import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

const build = (env: string) => {
  if (env === "production") {
    return {
      outDir: "dist",
      rollupOptions: {
        input: [resolve(__dirname, "index.html")],
      },
    };
  } else if (env === "lib") {
    return {
      outDir: "lib",
      lib: {
        target: "esnext",
        entry: resolve(__dirname, "src/packages/index.ts"),
        name: "v3-ol-map",
        formats: ["umd"],
        fileName: (format: string) => `v3-ol-map.${format}.js`,
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue",
          },
          assetFileNames: "v3-ol-map.[ext]",
        },
      },
      target: ["es2015"],
    };
  }
};
export default defineConfig(({ command, mode }): any => {
  return {
    server: {
      host: "0.0.0.0",
      https: false,
      port: 8081,
      open: true,
    },
    publicDir: mode === "lib" ? false : "public",
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
      extensions: [".ts", ".json", ".vue"],
    },
    plugins: [vue()],
    optimizeDeps: {
      include: ["core-js"],
    },
    esbuild: {
      drop: mode === "build" ? ["console", "debugger"] : [],
    },
    build: build(mode),
  };
});
