const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FixSo Backend API",
            version: "1.0.0",
            description: "REST API Documentation for FixSo Home Services Platform"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },

    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;