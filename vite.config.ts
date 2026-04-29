import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const faviconAliasPlugin = (): Plugin => ({
  name: "favicon-ico-alias",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === "/favicon.ico") {
        req.url = "/favicon.svg";
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === "/favicon.ico") {
        req.url = "/favicon.svg";
      }
      next();
    });
  },
});

export default defineConfig(({ command }) => {
  const plugins = [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    faviconAliasPlugin(),
    tanstackStart(),
    react(),
  ];

  if (command === "build") {
    plugins.push(cloudflare({ viteEnvironment: { name: "ssr" } }));
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    resolve: {
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    plugins,
  };
});
