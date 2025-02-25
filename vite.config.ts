import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), basicSsl()],
  test: {
    environment: "jsdom",
  },
  resolve: process.env.VITEST
    ? {
        conditions: ["browser"],
      }
    : undefined,
});
