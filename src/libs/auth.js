module.exports = {
    /**
     * Check if is Authenticated
     * @param { Request from Web Page} req 
     * @param { Response to Web Page} res 
     * @param { next Midlleware in stack } next 
     * @returns 
     */
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        }
        res.redirect('/signin');
    },
    /**
     * Check if isn't Authenticated
     * @param { Request from Web Page} req 
     * @param { Response to Web Page} res 
     * @param { next Midlleware in stack } next 
     * @returns 
     */
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()){
            return next();
        }
        res.redirect('/profile');
    },

    /**
     * Check if a user is the author of a link
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */

    async checkAuthor (req, res, next) {
    const { id } = req.params;
        const user_id = req.user.id;

        const links = await pool_db.query('SELECT * FROM links WHERE id = ? AND user_id = ?', [id, user_id]);

        if (links[0]){
            return next();
        }
        req.flash('message', 'You don\'t have permission to update this link');
        res.redirect('/links')
    }
}