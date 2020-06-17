const jwt = require('jsonwebtoken');
module.exports = function (req, res, next){
    const token = req.header('auth_token');
    if(!token) return res.status(401).send('access denied');

    try {
        console.log(req.user);
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.user);
        next();
    } catch (err) {
        res.status(400).send('invalid token');
    }

}