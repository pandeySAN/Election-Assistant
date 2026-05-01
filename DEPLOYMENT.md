# 🚀 Deploying Election Assistant to Render

This project is a monorepo with two separate Render services:

| Service | Type | Root Dir | URL |
|---|---|---|---|
| **Backend** | Web Service (Node) | `backend/` | `https://election-assistant-backend.onrender.com` |
| **Frontend** | Static Site (Vite/React) | `frontend/` | `https://election-assistant-frontend.onrender.com` |

---

## Option A — One-Click Blueprint (Recommended)

Render can deploy **both services** from the `render.yaml` at the root of this repo.

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your GitHub repo `pandeySAN/Election-Assistant`.
3. Render will read `render.yaml` and create both services automatically.
4. After the initial deploy, open the **Environment** tab for each service and set the secret env vars (see below).

---

## Option B — Manual Setup (two separate services)

### 1. Deploy the Backend (Web Service)

1. **New** → **Web Service** → connect `pandeySAN/Election-Assistant`.
2. Fill in:
   | Field | Value |
   |---|---|
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
3. Add environment variables (see below).
4. Click **Create Web Service**.

### 2. Deploy the Frontend (Static Site)

1. **New** → **Static Site** → connect `pandeySAN/Election-Assistant`.
2. Fill in:
   | Field | Value |
   |---|---|
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |
3. Add environment variables (see below).
4. Click **Create Static Site**.

---

## Environment Variables

### Backend Web Service

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | ✅ | `production` |
| `PORT` | ✅ | `10000` (Render assigns this automatically) |
| `GEMINI_API_KEY` | ✅ | Your Google Gemini API key |
| `GROQ_API_KEY` | ✅ | Your Groq API key |
| `CORS_ORIGIN` | ✅ | Your Render frontend URL, e.g. `https://election-assistant-frontend.onrender.com` |
| `MONGODB_URI` | ⬜ | MongoDB connection string (leave blank to use in-memory fallback) |
| `REDIS_URL` | ⬜ | Redis connection string (leave blank to use in-memory fallback) |

### Frontend Static Site

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Your backend URL + `/api`, e.g. `https://election-assistant-backend.onrender.com/api` |
| `VITE_APP_NAME` | ⬜ | `ElectBot` |
| `VITE_APP_VERSION` | ⬜ | `2.0.0` |

> **Important:** After the first deploy, copy the backend's public URL and set it as `VITE_API_URL` in the frontend's env vars, then trigger a redeploy of the frontend.

---

## Step-by-Step Order

```
1. Deploy Backend  →  copy its URL
2. Set env vars on Backend  (GEMINI_API_KEY, GROQ_API_KEY, CORS_ORIGIN)
3. Deploy Frontend  →  set VITE_API_URL to backend URL + /api
4. Set CORS_ORIGIN on Backend  →  Render backend redeploys automatically
```

---

## Verifying the Deployment

- **Health check**: `GET https://<backend-url>/api/health`
  - Should return `{ "status": "ok", ... }`
- **Frontend**: open `https://<frontend-url>` — ElectBot should load and be able to chat.

---

## Free Tier Notes

- On Render's free tier, Web Services **spin down after 15 minutes of inactivity**.  
  The first request after a cold start may take ~30 seconds.
- Static Sites are **always-on** with no spin-down.
- To avoid cold starts on the backend, use a free uptime service like [UptimeRobot](https://uptimerobot.com) to ping `/api/health` every 10 minutes.
