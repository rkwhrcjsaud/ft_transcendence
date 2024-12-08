// vite.config.js
export default {
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "bootstrap/scss/bootstrap";`,
            },
        },
    },
};