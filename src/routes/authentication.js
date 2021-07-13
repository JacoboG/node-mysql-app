const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res) => {
    const { fullname, username, password } = req.body;
    res.send('received')
});

module.exports = router;