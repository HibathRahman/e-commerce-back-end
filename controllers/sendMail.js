const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();


const transporter = nodeMailer.createTransport({
 service : "gmail",
  auth: {
    user: process.env.nodeMailer_user,
    pass: process.env.nodeMailer_pass,
  },
});


function _sendMail(toEmail, subject, content){
    const mailOption = {
        from : "m.hibath1@gmail.com",
        to   : toEmail,
        subject : subject,
        html : content
    }
 transporter.sendMail(mailOption, (error, info) =>{
    if(error){
        console.log("error occured", error);
    } else {
        console.log("Email sent :" , info.response);
    }
 })
}

module.exports = {_sendMail}





// const nodeMailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config();

// const transporter = nodeMailer.createTransport({
//     servise : "gmail",
//      auth: {
//        user: " hibath3011@gmail.com",
//        pass: "Hiiytu1",
   
      
//      },
//    });
   

// const details = {
//     from : "hibath3011@gmail.com",
//     to   : "m.hibath1@gmail.com",
//     subject : "Testing our nodeMailer",
//     html : "send mail from nodeMailer"
// }
// transporter.sendMail(details, (error, info) =>{
//     if(error){
//         console.log("error occured", error);
//     } else {
//         console.log("Email sent :" , info.response);
//     }
//  })