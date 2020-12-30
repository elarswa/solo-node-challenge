const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("<h1>Eric's Solo Node-Exercise</h1><p>Try testing '/people', '/planets'</p>");
});

module.exports = router;