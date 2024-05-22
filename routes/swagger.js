const router = require('express').Router();
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
router.use('/api-docs',
// #swagger.ignore = true
swaggerUI.serve);
router.get('/api-docs',
// #swagger.ignore = true
 swaggerUI.setup(swaggerDocument));

module.exports = router;