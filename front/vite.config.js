// vite.config.js
export default {
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "bootstrap/scss/bootstrap";`,
            },
        },
    },
};