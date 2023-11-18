const express = require("express");
const router = express.Router();

const { CheckUser } = require("../controllers/login");
const { InsertVerifyUser, InsertSignupUser } = require("../controllers/singin");

// RETRIVING TOKEN FROM PARAMS - anything after :  is params
// activation link
// when InsertSignupUser call , verifyuser will save in DB
router.get("/:token", async(req, res) => {
    try{
        const response = await InsertSignupUser(req.params.token)
        res.status(200).send(response)
    }catch(error){
        console.log(error);
        res.status(500).send(
          `   <html><body>
            <h5> Registration Failed</h5>
            <p>regard team</p>
            </body> </html>`
        )
    }

});

//  we get these details from user. so post method . req.body mean json 
//  check user already exists in DB or not through postman app 
router.post("/verify", async(req, res) => {
    try{
            const {name, email, password} = await req.body;
               

           const registerCredentials = await CheckUser(email);
                console.log(registerCredentials , "sign checked used")
                
            if(registerCredentials === false){
               await  InsertVerifyUser(name, email, password)
               res.status(200).send({message:"User created Successfully"})
            }else if (registerCredentials === true){
                res.status(200).send({message : "User Already Exists"})
            }else if(registerCredentials === "server busy"){
                res.status(500).send("server busy")
            }
    }catch(err){
       console.log(err);
    }


});

module.exports = router;
