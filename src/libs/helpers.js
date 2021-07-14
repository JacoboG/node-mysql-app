const pool_db = require('../database');
const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
        return false;
    }
};

helpers.checkAuthor = async (req, res, next) => {
    const { id } = req.params;
        const user_id = req.user.id;

        const links = await pool_db.query('SELECT * FROM links WHERE id = ? AND user_id = ?', [id, user_id]);

        if (links[0]){
            return next();
        }
        req.flash('message', 'You don\'t have permission to update this link');
        res.redirect('/links')
}

module.exports = helpers;
