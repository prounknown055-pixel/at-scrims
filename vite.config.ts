import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/", // ✅ Netlify / Vercel dono ke liye safe

    plugins: [react()],

    server: {
      port: 3000,
      host: true,
    },

    define: {
      // ✅ Gemini optional – empty rahe to bhi app crash nahi karega
      "process.env.GEMINI_API_KEY": JSON.stringify(
        env.GEMINI_API_KEY || ""
      ),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
