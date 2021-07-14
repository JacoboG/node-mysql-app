const express = require('express');
const router = express.Router();
const pool_db = require('../database');
const { isLoggedIn } = require("../libs/auth");

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const user_id = req.user.id;
    const newLink = {
        title,
        url,
        description,
        user_id
    };
    await pool_db.query('INSERT INTO links SET ?', [newLink]);
    req.flash('success', 'Link saved successfully')
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const user_id = req.user.id;
    const links =  await pool_db.query('SELECT * FROM links WHERE user_id = ?', [user_id]);
    res.render('links/list', {links: links});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    await pool_db.query('DELETE FROM links WHERE id = ? AND user_id = ?', [id, user_id]);
    req.flash('success', 'Link Removed successfully');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const links = await pool_db.query('SELECT * FROM links WHERE id = ? AND user_id ?', [id, user_id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const user_id = req.user.id;
    const newLink = {
        title,
        url,
        description
    };
    await pool_db.query('UPDATE links SET ? WHERE id = ? AND user_id = ?', [newLink, id, user_id]);
    req.flash('success', 'Link Update successfully');
    res.redirect('/links');
});

module.exports = router;