import { defineConfig, loadEnv } from "vite";
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
  const { VITE_BASE_URL, VITE_JOINT_API_URL } = loadEnv(mode, process.cwd());
  return {
    base: VITE_BASE_URL,
    server: {
      host: "localhost",
      port: 8989,
      open: true,
      proxy: {
        [VITE_JOINT_API_URL]: {
          target: "http://36.248.238.35:8888/admin-api",
          changeOrigin: true,
          rewrite: (path: string) => {
            const regex = new RegExp(`${VITE_JOINT_API_URL}`, "g");
            return path.replace(regex, "");
          },
        },
      },
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
        // 如果指定了outputDir，生成的d.ts文件会放在这个目录下
        outDir: "es",
        tsconfigPath: "tsconfig.json",
      }),
    ],
    optimizeDeps: {
      include: ["core-js"],
      exclude: ["ol-ext/filter/mask"],
      force: true,
    },
    esbuild: {
      drop: command === "build" ? ["console", "debugger"] : [],
    },
    build: build(mode),
  };
});
