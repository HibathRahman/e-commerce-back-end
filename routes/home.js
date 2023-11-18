const express = require('express');
const router = express.Router();
const {AuthorizeUser} = require('../controllers/login')
const jwt = require('jsonwebtoken');



router.get('/', async(req, res) => {
 try{
    // req.headers.authorization this is token as a string , this token will convert to email
    // auth_token - inside of this , email is there
    const auth_token = await req.headers.authorization;
    const loginCredentials = await AuthorizeUser(auth_token);
    console.log(loginCredentials,'auth redis 3');
    
    if(loginCredentials === false){
        res.status(200).send("invalid user")
    }else{
        res.json(loginCredentials)
    }
 }catch(error){
    console.log(error);
    res.status(400).send("server busy")
 }

})
module.exports =router;