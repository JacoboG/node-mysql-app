const express = require('express');
const router = express.Router();
const pool_db = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool_db.query('INSERT INTO links SET ?', [newLink]);
    res.redirect('/links');
});

router.get('/', async (req, res) => {
    const links =  await pool_db.query('SELECT * FROM links');
    res.render('links/list', {links: links});
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;

    await pool_db.query('DELETE FROM links WHERE ID = ?', [id]);
    res.redirect('/links');
});

module.exports = router;