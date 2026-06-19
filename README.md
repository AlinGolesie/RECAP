# RECAP — Recycling Engagement through a Computing Application for Plastic

RECAP is a low-cost smart reverse vending machine prototype built with a Raspberry Pi 4 and a full-stack web application. It uses on-device machine learning to identify plastic bottles and rewards users with points through a real-time web dashboard.

> Dissertation project — BSc Computing, Southampton Solent University, 2024–25  
> Student: Alin Igna Golesie

---

## Features

- **Live bottle classification** — MobileNetV2 model runs locally on the Raspberry Pi (no cloud inference)
- **Real-time web dashboard** — points, bottle count, CO₂ saved, weekly progress chart
- **Fraud prevention** — 80% confidence threshold rejects uncertain scans and non-bottle objects
- **Scan history** — every scan logged to Firebase Firestore
- **Rewards catalogue** — redeem points for vouchers and discounts
- **Recycling map** — postcode search finds recycling points near you using OpenStreetMap

---

## System Architecture

```
[Raspberry Pi 4]  ──►  [Node.js / Express API]  ──►  [Firebase Firestore]
  Camera Module 3            Port 3000                   Users · Scans · Points
  Edge Impulse SDK       Scan queue · Results
  MJPEG Stream (8080)
        │
        ▼
  [React Web App]  ◄──  Firestore real-time listener
  Dashboard · Map · Rewards
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Device | Raspberry Pi 4 (4GB), Camera Module 3, Raspberry Pi OS |
| ML | Edge Impulse, MobileNetV2 (transfer learning), 3 classes |
| Device software | Python 3, Picamera2, Edge Impulse Linux SDK, OpenCV |
| Backend | Node.js, Express, Firebase Admin SDK |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication |
| Frontend | React 18, TypeScript, Tailwind CSS, Leaflet.js |
| Map data | OpenStreetMap (Overpass API), postcodes.io |

---

## Hardware Requirements

| Component | Details | Approx. Cost |
|---|---|---|
| Raspberry Pi 4 Model B | 4GB RAM | £55 |
| Camera Module 3 | Sony IMX708, 12MP, Autofocus | £25 |
| MicroSD Card | 32GB, Class 10 | £8 |
| USB-C Power Supply | Official Pi PSU | £8 |
| **Total** | | **~£96–£130** |

---

## Project Structure

```
recap/
├── backend/                  # Node.js / Express API
│   ├── routes/
│   │   ├── scanRoutes.js     # POST /api/scan — awards points via Firestore
│   │   └── requestRoutes.js  # Scan queue between frontend and Pi
│   ├── firebase.js           # Firebase Admin SDK initialisation
│   └── server.js             # Express entry point (port 3000)
│
├── frontend/                 # React 18 + TypeScript web app
│   └── src/
│       ├── app/pages/        # Dashboard, ScanBottle, Map, History, Rewards
│       ├── app/components/   # Header, Card, Button, Input
│       ├── context/          # AppContext — Firebase auth + Firestore listeners
│       └── firebase/         # Firebase client config
│
└── raspberry_pi/             # Device scan script
    ├── scan.py               # Main script — camera, Edge Impulse, polling loop
    └── .env                  # Device configuration (not committed)
```

---

## Setup

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication and Firestore enabled
- A Firebase service account key (download from Firebase Console → Project Settings → Service Accounts)
- A trained Edge Impulse model exported as Linux (AARCH64) `.eim` file

---

### 1. Backend

```bash
cd backend
npm install
```

Place your Firebase service account key at `backend/serviceAccountKey.json` (never commit this file).

```bash
node server.js
```

Backend runs on port 3000.

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/src/firebase/config.ts` with your Firebase project credentials.

App runs at `http://localhost:5173`.

---

### 3. Raspberry Pi

Copy `raspberry_pi/scan.py` and `raspberry_pi/.env` to your Pi.

Install dependencies on the Pi:

```bash
pip3 install requests python-dotenv picamera2 opencv-python
pip3 install edge_impulse_linux
```

Create `.env` in the same folder as `scan.py`:

```env
RECAP_USER_ID=<your-firebase-uid>
RECAP_BACKEND_URL=http://<backend-ip>:3000
EIM_MODEL_PATH=./your-model.eim
DEVICE_ID=raspberry-pi-01
MIN_CONFIDENCE=0.80
STREAM_PORT=8080
```

Run the scan script:

```bash
python3 scan.py
```

The Pi will start the MJPEG snapshot server on port 8080 and poll the backend every 2 seconds for scan requests.

---

## ML Model

| Metric | Value |
|---|---|
| Architecture | MobileNetV2 96×96 (transfer learning) |
| Classes | 500ml · 750ml · unknown |
| Dataset | 158 images (80/20 train/test split) |
| Overall accuracy | **91.30%** |
| 750ml recall | 100% |
| Unknown recall | 100% |
| Confidence threshold | 80% |
| End-to-end scan latency | 2.36 seconds (avg) |

---

## Evaluation

- **SUS score:** 87.8 / 100 — *Excellent* usability band (Lewis, 2018)
- **Intent to use:** 4.48 / 5 (n=25, Jisc Online Survey)
- **Participants:** 25 users + Manchester Campus Foundation Year students

---

## Environment Variables

### Backend
| Variable | Description |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | JSON string of service account (alternative to key file) |
| `PORT` | Server port (default: 3000) |

### Raspberry Pi (`.env`)
| Variable | Description |
|---|---|
| `RECAP_BACKEND_URL` | URL of the Node.js backend |
| `EIM_MODEL_PATH` | Path to the `.eim` model file |
| `DEVICE_ID` | Identifier for this Pi in logs |
| `MIN_CONFIDENCE` | Minimum classification confidence (default: 0.80) |
| `STREAM_PORT` | MJPEG snapshot server port (default: 8080) |

---

## Security Notes

- `backend/serviceAccountKey.json` is excluded from version control via `.gitignore`
- `raspberry_pi/.env` is excluded from version control
- Firebase security rules should be configured to restrict users to their own data
- The backend scan endpoints should be protected with Firebase token verification before production deployment

---

## Author

**Alin Igna Golesie**  
BSc Computing — Southampton Solent University  
[github.com/AlinGolesie](https://github.com/AlinGolesie)
