# Arman Portfolio (Full Stack)

Deployable full-stack portfolio web app for **Arman** (Video Editor).

## Stack
- Node.js + Express backend
- API routes for profile/projects/contact
- Responsive animated frontend (HTML/CSS/JS)
- Contact submissions stored in `data/messages.json`

## Run locally
```bash
npm install
npm start
```

Open: `http://localhost:3000`

## API endpoints
- `GET /api/health`
- `GET /api/profile`
- `GET /api/projects`
- `POST /api/contact`
- `GET /api/messages`
- `GET /api/clients/excel` (downloads latest Excel sheet)

## Auto-updating Excel
- Every new contact submission automatically updates `data/clients.xlsx`.
- You can download the latest synced sheet from `/api/clients/excel`.

## Deploy options
- Render: `render.yaml` included
- Railway: `railway.json` included
- Any Docker host: `Dockerfile` included

## Important domain note
`arman.port.com` is a **subdomain of `port.com`**.
You can only use it if you own `port.com` DNS.

If you do not own `port.com`, buy a domain like:
- `armanportfolio.com`
- `armaneditz.com`
- `arman-portfolio.com`

Then connect it to your hosting provider.

## Public domain setup (works on all devices)
1. Deploy this app on Render/Railway.
2. Copy generated app URL (example: `https://arman-portfolio.onrender.com`).
3. In your domain DNS settings:
   - Add `CNAME` for `www` -> your app host.
   - Add root (`@`) record using provider instructions (ALIAS/ANAME/A depending on registrar).
4. Add your custom domain inside Render/Railway project settings.
5. Wait for SSL certificate to become active.

After DNS propagation, your link works globally on mobile + desktop.

## Notes
- Update profile/project content in `server.js`.
- `data/messages.json` is file-based storage. For production-grade contact handling, move to database or email API.
