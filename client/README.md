# CIVIX AI Client

## Deploying with Vercel

Deploy the backend and frontend as separate Vercel projects:

1. Create a backend project from this repository with **Root Directory** set to `server`. Its Vercel config deploys the Express API.
2. Add the backend environment variables in Vercel: `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`. Set `CLIENT_URL` to the frontend's production origin, such as `https://civix.example.com`. Add `GROQ_API_KEY` and the `CLOUDINARY_*` values when using those features.
3. Deploy the frontend as a second project with **Root Directory** set to `client`.
4. Add `VITE_API_URL` to the frontend project's Production environment, with the backend's origin only, for example `https://civix-api.example.com` (no `/api` suffix).
5. Redeploy the frontend after adding or changing `VITE_API_URL`; Vite embeds it during the build.

The client production build fails with a clear error if `VITE_API_URL` is missing. Local development defaults to `http://localhost:5000`.

## Local Development

Copy `.env.example` to `.env.local` and set `VITE_API_URL=http://localhost:5000`, then run `npm run dev` from the repository root.

The Express backend also needs its own `server/.env` for local database, JWT, AI, and Cloudinary settings.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
