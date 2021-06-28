const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');
const router = new express.Router();
const config = require('./common');
// swagger 문서에서 보여줄 API 전체정보 정의
const options = { // line 27
  swaggerDefinition: {
    info: {
      title: 'VCAST 3.0 Core API', // Title (required).
      version: '1.0.0',
      description: 'VCAST 3.0 Backend API',
    },
    basePath: '/',
    components: {},
  },
  apis: [
    './src/routes/*.js',
  ], // Path to the API docsco
};

// SWAGGER_HOST
options.swaggerDefinition.host = config.swagger.host || 'localhost:3002';
// options.swaggerDefinition.schemes = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? ['https'] : ['http'];
options.swaggerDefinition.schemes = ['http', 'https'];

// options.swaggerDefinition.components.res =constant.httpstatus.description;
const swaggerSpec = swaggerJSDoc(options);

// swagger URL 정의
router.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

module.exports = swaggerSpec;
