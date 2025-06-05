const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingsalescontroller');
const auth = require('../middleware/auth');