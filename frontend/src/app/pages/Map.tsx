import { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";
import 'leaflet/dist/leaflet.css';

interface RecyclingLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  operator: string;
  distance: number;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Map() {
  const [postcode, setPostcode]               = useState("");
  const [locations, setLocations]             = useState<RecyclingLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<RecyclingLocation | null>(null);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");

  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef     = useRef<any>(null);
  const markersRef     = useRef<any[]>([]);

  // initialise the map once, centred on the UK
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      leafletRef.current = L;

      const map = L.map(mapRef.current).setView([54.5, -2.0], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // re-centre map when user picks a location from the list
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation) {
      mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 16);
    }
  }, [selectedLocation]);

  function buildMarkerIcon(L: any) {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color:#22C55E;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 6px rgba(0,0,0,0.3);">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }

  function placeMarkers(locs: RecyclingLocation[]) {
    const L   = leafletRef.current;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    // clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const icon = buildMarkerIcon(L);
    locs.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-size:14px;">
            <h3 style="font-weight:600;margin-bottom:4px;">${loc.name}</h3>
            <p style="color:#666;font-size:12px;">${loc.operator}</p>
            <p style="color:#22C55E;font-size:12px;margin-top:4px;">${loc.type}</p>
            <p style="color:#888;font-size:12px;">${loc.distance.toFixed(1)} km away</p>
          </div>
        `);
      marker.on("click", () => setSelectedLocation(loc));
      markersRef.current.push(marker);
    });
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = postcode.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setLocations([]);
    setSelectedLocation(null);

    try {
      // 1. postcode → lat/lng
      const pcRes  = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`);
      const pcData = await pcRes.json();
      if (pcData.status !== 200) throw new Error("Invalid postcode");

      const { latitude: lat, longitude: lng } = pcData.result;

      // 2. find recycling amenities within 5 km via Overpass
      const query = `[out:json][timeout:15];
        node["amenity"="recycling"](around:5000,${lat},${lng});
        out body;`;

      const ovRes  = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
      const ovData = await ovRes.json();

      if (!ovData.elements || ovData.elements.length === 0) {
        setError("No recycling points found within 5 km of that postcode.");
        return;
      }

      // 3. parse and sort by distance, keep nearest 15
      const parsed: RecyclingLocation[] = ovData.elements.map((el: any) => ({
        id:       el.id,
        name:     el.tags?.name || el.tags?.brand || "Recycling Point",
        lat:      el.lat,
        lng:      el.lon,
        type:     el.tags?.recycling_type === "centre" ? "Recycling Centre" : "Reverse Vending Machine",
        operator: el.tags?.operator || el.tags?.brand || "RECAP Corporation",
        distance: haversineKm(lat, lng, el.lat, el.lon),
      }));

      const sorted = parsed.sort((a, b) => a.distance - b.distance).slice(0, 15);

      setLocations(sorted);
      setSelectedLocation(sorted[0]);

      // 4. update map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lng], 14);
        placeMarkers(sorted);
      }
    } catch {
      setError("Could not find recycling points. Please check the postcode and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Recycling Locations</h2>
          <p className="text-gray-400">Search by postcode to find recycling points near you</p>
        </div>

        {/* postcode search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter postcode e.g. CA11 7JD"
            className="flex-1 max-w-xs px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {error && (
          <p className="mb-4 text-sm text-red-400">{error}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden h-[400px] md:h-[600px]">
              <div ref={mapRef} className="w-full h-full" />
            </Card>
          </div>

          <div className="space-y-4">
            {/* selected location detail */}
            {selectedLocation ? (
              <Card className="border-green-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-100 mb-1">{selectedLocation.name}</h3>
                    <p className="text-xs text-gray-400">{selectedLocation.operator}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Navigation className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-green-400">{selectedLocation.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-300">{selectedLocation.distance.toFixed(1)} km away</span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <p className="text-sm text-gray-400 text-center py-4">
                  Search a postcode to see nearby recycling points
                </p>
              </Card>
            )}

            {/* results list */}
            {locations.length > 0 && (
              <Card>
                <h3 className="font-semibold text-gray-100 mb-3">
                  Nearby Points <span className="text-gray-500 font-normal text-sm">({locations.length})</span>
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedLocation?.id === loc.id
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-4 h-4 flex-shrink-0 ${
                          selectedLocation?.id === loc.id ? "text-green-500" : "text-gray-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${
                            selectedLocation?.id === loc.id ? "text-green-400" : "text-gray-300"
                          }`}>
                            {loc.name}
                          </p>
                          <p className="text-xs text-gray-500">{loc.distance.toFixed(1)} km · {loc.type}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
