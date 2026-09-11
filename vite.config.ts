import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/anime-sedai-plus/" : "/",
  plugins: [tailwindcss(), react()],
}));
