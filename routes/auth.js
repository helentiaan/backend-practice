const router = require('express').Router();
const User = require ('../model/User');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.post('/register', async (req,res)=>{
    //check validation
    const{error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check unique user
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //hash psswaord
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //create new user
    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashPassword
    });
    console.log(user);
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
        
    }
}); 

//login
router.post('/login', async (req,res) =>{
        //check validation
        const{error} = loginValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        
        //check unique user
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('email is not valid');

        //check password is correct
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(400).send('Invalid password');

        //create and assign token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth_token', token).send(token);
        res.send('logged in');
});

module.exports = router;