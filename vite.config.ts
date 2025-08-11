import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "");

  // 获取API基础URL，如果没有设置则使用默认值
  const apiBaseUrl = "http://localhost:5001";

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
