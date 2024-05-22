const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger.js'));
router.use('/user', require('./user.js'));
router.use('/company', require('./company.js'));
router.use('/job', require('./job.js'));
router.use('/application', require('./application.js'));

router.get('/login', passport.authenticate('github'), (req, res) => {});
router.get('/logout', (req, res, next) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.session.destroy();
        return res.redirect('/');
    });
});

module.exports = router;