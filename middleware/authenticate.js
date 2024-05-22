const isAuthenticated = (req, res, next) => {
    if(req.session.user === undefined) {
        return res.status(401).send("Unauthorized");
    }
    next();
}

module.exports = {isAuthenticated}