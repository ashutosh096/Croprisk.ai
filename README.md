# 🌾 CropRisk.ai — Enterprise Operations

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-Workspace-F69220.svg?logo=pnpm&logoColor=white)](https://pnpm.io)

**CropRisk.ai** is a premium, high-performance agricultural risk assessment and crop health analytics dashboard powered by **ClimAgroAnalytics**. This enterprise portal empowers agribusinesses, agronomists, and crop insurers with real-time risk intelligence, meteorological data correlation, and visual crop monitoring maps.

---

## ✨ Features

- 🛰️ **Crop Health Monitoring:** In-depth satellite index analytics tracking NDVI, soil moisture, water stress, and canopy temperature.
- 📊 **Dynamic Analytical Dashboards:** Interactive visualization charts built with Recharts for telemetry and historical metrics.
- ⚡ **Vite-Powered Frontend:** Optimized, hot-reloading user interface leveraging React 19 and TypeScript.
- 🎨 **Premium UI/UX (Glassmorphism):** An elegant, animated glassmorphism login portal featuring smooth gradient meshes and pulsing glow outlines.
- 🔒 **Secure Authorization:** Enterprise credential portal with user verification states.

---

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/)
- **Bundler & Dev Server:** [Vite 7](https://vite.dev/)
- **Programming Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [Wouter](https://github.com/molecula-org/wouter)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Package Manager:** [pnpm](https://pnpm.io/)

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have **Node.js** (v18+) and **pnpm** installed on your local machine.

### ⚙️ Installation
1. Clone the repository to your local directory.
2. Install the workspace dependencies:
   ```bash
   pnpm install
   ```

### 🔑 Environment Variables
Vite requires the following environment variables to be set for the configuration to run and build:

| Variable | Description | Default / Recommended |
| :--- | :--- | :--- |
| `PORT` | Local development port | `5173` |
| `BASE_PATH` | Server base folder path | `/` |

On Windows PowerShell:
```powershell
$env:PORT="5173"
$env:BASE_PATH="/"
```

On Linux / macOS Bash:
```bash
export PORT=5173
export BASE_PATH=/
```

### 💻 Running Locally
To launch the development server with Hot Module Replacement (HMR):
```bash
pnpm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser to view the application.

### 📦 Production Build
To compile the static production bundle:
```bash
pnpm run build
```
The production-ready assets will compile directly inside `dist/public/`.

---

## ☁️ Deployment (Vercel)

1. Push your project to **GitHub**.
2. Connect your repository on the [Vercel Dashboard](https://vercel.com).
3. Set the following Build settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist/public` *(⚠️ Important: Override Vercel's default output directory to `dist/public`)*
4. Configure the **Environment Variables**:
   - `BASE_PATH` ➜ `/`
   - `PORT` ➜ `5173`
5. Click **Deploy**.
