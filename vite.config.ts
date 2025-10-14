import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_API_TARGET ?? "https://getsport.3docorp.vn/";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@layout": path.resolve(__dirname, "./src/layout"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@images": path.resolve(__dirname, "./src/images"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@api": path.resolve(__dirname, "./src/api"),
        "@app": path.resolve(__dirname, "./src/app"),
        "@redux": path.resolve(__dirname, "./src/redux"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@features": path.resolve(__dirname, "./src/features"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false, // DEV bỏ qua TLS
        },
      },
    },
    preview: {
      proxy: {
        "/api": { target, changeOrigin: true, secure: false },
      },
    },
  };
});
