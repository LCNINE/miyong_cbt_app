import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const htmlYearReplace = (): Plugin => ({
  name: 'html-year-replace',
  transformIndexHtml: (html) =>
    html.replace(/%CURRENT_YEAR%/g, String(new Date().getFullYear())),
});

export default defineConfig({
  plugins: [react(), htmlYearReplace()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // '@'를 'src'로 매핑
    }
  },
  build: {
    minify: false,  // minify 해제
  }
});
