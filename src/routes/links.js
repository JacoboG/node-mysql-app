const express = require('express');
const router = express.Router();
const pool_db = require('../database');
const { isLoggedIn } = require("../libs/auth");

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool_db.query('INSERT INTO links SET ?', [newLink]);
    req.flash('success', 'Link saved successfully')
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links =  await pool_db.query('SELECT * FROM links');
    res.render('links/list', {links: links});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool_db.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Link Removed successfully');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool_db.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool_db.query('UPDATE links SET ? WHERE id = ? ', [newLink, id]);
    req.flash('success', 'Link Update successfully');
    res.redirect('/links');
});

module.exports = router;