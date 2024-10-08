import {defineConfig} from "cypress";

export default defineConfig({
    component: {
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
    },

    e2e: {
        specPattern: "**/*.e2e.cy.{js,jsx,ts,tsx}",
        excludeSpecPattern: "public/**/*.e2e.cy.{js,jsx,ts,tsx}",
        baseUrl: "http://localhost:3001",
        // setupNodeEvents(on, config) {
        //     // implement node event listeners here
        // },
    },
});
