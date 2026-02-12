import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                finds: resolve(__dirname, "src/finds.html"),
                report: resolve(__dirname, "src/report.html"),
                info: resolve(__dirname, "src/info.html"),
                account: resolve(__dirname, "src/account.html"),
                settings: resolve(__dirname, "src/settings.html"),
                agb: resolve(__dirname, "src/agb.html"),
                datenschutz: resolve(__dirname, "src/datenschutz.html"),
            },
        },
    },
});
