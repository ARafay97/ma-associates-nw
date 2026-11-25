# MA Associates NW Ltd

Website for MA Associates NW Ltd, built with Next.js and Tailwind CSS. It has a public booking form and a password-protected admin dashboard for managing bookings.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the dashboard.

## Environment variables

| Name | What it's for |
| --- | --- |
| `ADMIN_USERNAME` | Username for `/admin` |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_SESSION_SECRET` | Random string (32+ characters) that signs the login cookie |
| `BOOKINGS_FILE` | Optional. Path to the bookings JSON file (default `data/bookings.json`) |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Bookings

- Customers fill in the form in the **Book** section of the home page.
- Each booking is saved to `data/bookings.json`. The file is git-ignored because it holds customer details.
- In `/admin` you can filter bookings, mark them new, confirmed, completed or cancelled, and delete them.
- There's no public link to `/admin`. Go to the URL directly.

### Hosting note

The bookings file is saved to the server's disk, so the site needs a host with a persistent, writable disk. That means a VPS, Railway or Render with a volume, or similar, run with `npm run build && npm start`. On serverless hosts such as Netlify or Vercel, the disk is read-only or wiped between requests, so bookings would be lost. To deploy there, switch storage to a database or a key-value store.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm start`: run the production build
- `npm run lint`: lint with oxlint
