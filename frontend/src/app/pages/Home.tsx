import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Recycle, Award, MapPin, TrendingUp, Leaf, Users } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-green-500">RECAP</h1>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/login")} variant="secondary">
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-2xl shadow-green-500/30">
              <Recycle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Welcome to <span className="text-green-500">RECAP</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Recycling Engagement through a Computing Application for Plastic
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
              Turn your recycling efforts into rewards. Scan plastic bottles, earn points, and help save the environment one bottle at a time.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/register")} className="px-8 py-4 text-lg">
                Start Recycling
              </Button>
              <Button onClick={() => navigate("/login")} variant="secondary" className="px-8 py-4 text-lg">
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">How It Works</h2>
            <p className="text-gray-400">Simple steps to start making a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-3">1. Create Account</h3>
              <p className="text-gray-400">Sign up and join the recycling community in seconds</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-3">2. Scan Bottles</h3>
              <p className="text-gray-400">Use our smart detection system to identify plastic bottles</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-3">3. Earn Rewards</h3>
              <p className="text-gray-400">Collect points and track your environmental impact</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">Why Choose RECAP?</h2>
            <p className="text-gray-400">More than just recycling, it's a movement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <TrendingUp className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Track Progress</h3>
              <p className="text-gray-400 text-sm">Monitor your recycling journey with detailed analytics</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <Award className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Earn Points</h3>
              <p className="text-gray-400 text-sm">Get rewarded for every bottle you recycle</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <MapPin className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Find Locations</h3>
              <p className="text-gray-400 text-sm">Discover recycling points near you</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <Leaf className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Save Planet</h3>
              <p className="text-gray-400 text-sm">Make a real impact on the environment</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-green-500/10 to-blue-500/10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users making the world a cleaner place
          </p>
          <Button onClick={() => navigate("/register")} className="px-10 py-4 text-lg">
            Get Started Free
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-500">RECAP</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Recycling Engagement through a Computing Application for Plastic
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p className="font-medium text-gray-300">Alin Golesie</p>
                <p>Solent University Student</p>
                <p className="text-green-400">Southampton, UK</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                  aria-label="WhatsApp"
                >
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-500 text-xs mt-4">
                Follow us for updates and recycling tips
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2026 RECAP - Recycling Engagement Computing Application for Plastic
            </p>
            <p className="text-gray-500 text-xs mt-2">
              A sustainability project by Alin Golesie - Solent University
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
