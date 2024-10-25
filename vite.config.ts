import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
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
        external: ["vue", "vue-router"],
        output: {
          exports: "named",
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
      extensions: [".ts", ".vue", ".js", ".json", ".css", ".node", ".sass"],
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
      ],
    },
    plugins: [
      vue(),
      dts({
        // 这里定义了需要生成d.ts文件的目录，如果有多个目录，可以使用数组
        include: ["src/packages/**/*.{vue,ts}"],
      }),
    ],
    optimizeDeps: {
      include: ["core-js"],
    },
    esbuild: {
      drop: command === "build" ? ["console", "debugger"] : [],
    },
    build: build(mode),
  };
});
