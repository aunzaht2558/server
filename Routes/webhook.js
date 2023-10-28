const express = require("express");
const router = express.Router();

const {
  getaccount
} = require("../Controllers/handlewebhook");

// http://localhost:5000/api/register
router.post("/webhook", getaccount);

module.exports = router;
