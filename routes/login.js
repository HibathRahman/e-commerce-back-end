const express = require('express');
const router = express.Router();
const {AuthenticaeUser} = require('../controllers/login');
const {client} = require('../redis');

// promises 
client.connect()
.then(() => {
    console.log("connected to redis");
})
.catch((error)=>{
    console.log(error);
})



router.post('/verify', async (req, res)=>{
   try{
    const {email , password} = await req.body;
   

    const loginCredentials = await AuthenticaeUser(email , password)
    console.log(loginCredentials , "login Authentic user");

    if(loginCredentials === "Invalid UserName or Password"){
        res.status(200).send("Invalid UserName or Password")

    }else if(loginCredentials ==="Server Busy"){
        res.status(200).send("Server Busy")
    }else {
        res.status(200).json(loginCredentials)
//  if username and password matched , token will be send as response to the frontEnd
    }

   }catch(error){
    console.log(error);
   }

})

module.exports = router;
