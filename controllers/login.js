//  registered user - already verified
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { client } = require("../redis");

const dotenv = require("dotenv");
dotenv.config();

//  check this email in DB
// if the particular user exists , return value
async function CheckUser(email) {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return "server busy";
  }
}

async function AuthenticaeUser(email, password) {
  try {
    const userCheck = await User.findOne({ email: email });
    console.log(userCheck, "from DB");
    const validPassword = await bcrypt.compare(password, userCheck.password);
    console.log(validPassword, "validPassword-bcrypt");

    if (validPassword === true) {
      const token = jwt.sign({ email }, process.env.login_Secret_Token);
      const response = {
        id: userCheck._id,
        name: userCheck.name,
        email: userCheck.email,
        password: userCheck.password,
        token: token,
        status: true,
        isAdmin: userCheck.isAdmin,
      };
      //  redis is a database , it store the data as a key value pair
      // key = `key - ${email}`  ,  value = JSON.stringify(response))
      await client.set(`key - ${email}`, JSON.stringify(response));
      // update the oldtoken to this new token in db
      await User.findOneAndUpdate(
        { email: userCheck.email },
        { $set: { token: token } },
        { new: true }
      );
      console.log(response)
      return response;
    } else {
      return "Invalid UserName or Password";
    }
  } catch (error) {
    console.log(error);
    return "Server Busy";
  }
}

// user get access and Authorize when they click activation link
async function AuthorizeUser(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.login_Secret_Token);
    if (decodedToken) {
      //  decode mean get the original gmail
      const email = decodedToken.email;
      // with this email , we can get user info from two databasebcoz redis is easy to get
      //  - mongoDB , redis ,    we use here redis
      // already we stored all values in json.stringify in redis client , now its parse it
      const auth = await client.get(`key - ${email}`);
      if (auth) {
        const data = JSON.parse(auth);
        console.log(data, "auth redis 1");
        return data;
      } else {
        // taking from mongoDB -- full deatils
        const data = await User.findOne({ email: email });
        console.log(data, "auth redis 2");
        return data;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { CheckUser, AuthenticaeUser, AuthorizeUser };
