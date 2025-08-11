import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
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
});
