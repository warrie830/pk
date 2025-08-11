import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({}) => {
  return {
    plugins: [react()],
    css: {
      modules: {
        // 启用CSS Modules
        localsConvention: "camelCase", // 支持驼峰命名
        generateScopedName: "[name]__[local]___[hash:base64:5]", // 自定义类名生成规则
      },
      preprocessorOptions: {
        scss: {
          // SCSS全局变量和混入
          additionalData: `
            @use "./src/styles/variables.scss" as *;
            @use "./src/styles/mixins.scss" as *;
          `,
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:5001",
          changeOrigin: true,
          // 移除路径重写，保持原始路径
          // rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    // 定义全局环境变量
  };
});
