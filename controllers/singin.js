const { _sendMail } = require("./sendMail");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../Models/verifyUser");
dotenv.config();

async function InsertVerifyUser(name, email, password) {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);
    // verifyUSER is a Registration schema
    const newUser = new verifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });
    await newUser.save();
    console.log(newUser, "signin -verifyUser saved in DB");
    // 1st create the activation ink and write content
    const activationLink = `${process.env.dev_uri}${token}`;
    console.log(activationLink);

    const content = `<h4> Hi there </h4>
        <h5> Welcome to the Hibath App</h5>
        <a href="${activationLink}">click here to Activate</a>
        <p>Regard Team</p>`;
    _sendMail(email, "verifyUser", content);
  } catch (err) {
    console.log(err);
  }
}
// whenever generate the token create function seperately
// here guvi is a secret key
function generateToken(email) {
  const token = jwt.sign(email, process.env.signUp_Secret_Token);
  return token;
}

// user after click activation link , data will store in user schema
// and successfully mail also sent
// response also display
async function InsertSignupUser(token) {
  try {
    const userVerify = await verifyUser.findOne({ token: token });
    if (userVerify) {
      let newUser;
      console.log(userVerify.email,process.env.admin_email)
      if (userVerify.email === process.env.admin_email) {
        newUser = new User({
          name: userVerify.name,
          email: userVerify.email,
          password: userVerify.password,
          isAdmin: true,
        });
      } else {
        newUser = new User({
          name: userVerify.name,
          email: userVerify.email,
          password: userVerify.password,
          isAdmin: false,
        });
      }
      await newUser.save();
      await userVerify.deleteOne({ token: token });
      const content = `<h4> Hi there </h4>
            <h5> Welcome to the Hibath App</h5>
            <h5> You Are Successfully Registered</h5>
            <p>Regard Team</p>`;

      _sendMail(newUser.email, "Registration successful", content);
      return `<h4> Hi there </h4>
            <h5> Welcome to the Hibath App</h5>
            <h5> You Are Successfully Registered</h5>
            <p>Regard Team</p>`;
    } else {
      return `<h4> hi there </h4>
                    <h5> Registration Failed</h5>
                    <p>regard team</p>`;
    }
  } catch (error) {
    console.log(error);
    return ` <html><body>
    <h5> Registration Failed</h5>
    <p>regard team</p>
    </body> </html>`;
  }
}

module.exports = { InsertVerifyUser, InsertSignupUser };
