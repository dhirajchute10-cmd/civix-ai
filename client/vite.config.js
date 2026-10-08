import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "production" && !process.env.VITE_API_URL?.trim()) {
    throw new Error(
      "VITE_API_URL is required for production builds. Set it to the deployed backend URL."
    );
  }

  return {
    plugins: [react()],
  };
})
