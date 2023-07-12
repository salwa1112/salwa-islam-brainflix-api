const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');

//Routers determine where the request will go, ie. which logic will be run
router.get('/giveMeASecret', controller.grabSecret);

module.exports = router;