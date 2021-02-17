const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Seedly Express API",
      version: "0.1.0",
      description: "A simple e-commerce API, selling seeds",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      //   contact: {
      //     name: "LogRocket",
      //     url: "https://logrocket.com",
      //     email: "info@email.com",
      //   },
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
  },
  apis: ["./docs/*.yaml"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
