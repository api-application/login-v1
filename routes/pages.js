

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const passport = require('passport');
const express = require('express');
const user = require('./db');
const router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id).exec();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

function redirectIfLoggedIn(req, res, next) {
    if (req.user) return res.redirect('/profile');
    return next();
  }

router.get('/', (req, res, next) => {

    res.render('home', { title: 'Home' });
});
router.get("/contact", function (req, res) {
    res.render("layouts/contact", { title: 'Contact' })
});
router.post("/contact", urlencodedParser, function (req, res) {
    const info_option = `
    <p>  You have New Contact Request</p>
    <ul>
      <li>First Name: ${req.body.firstname} </li>
      <li>Last Name: ${req.body.lastname} </li>
      <li>Email: ${req.body.email} </li>
    </ul>
      <h3> Message</h3>
      <p>Name: ${req.body.message} </p>  
    `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'dayna.predovic52@ethereal.email', // generated ethereal user
            pass: 'T91H2ATHNEdyue7Gd5', // generated ethereal password
        }
    });
    let mailOptions = {
        from: 'dayna.predovic52@ethereal.email', // sender address
        to: "meysamnajafitavani@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: info_option, // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    });
    res.render("layouts/contact-success", { data: req.body });
});
router.get("/about", function (req, res) {
    res.render("layouts/about", { title: 'About' })
});
router.get("/signin",redirectIfLoggedIn,  (req, res) => {
    res.render("layouts/signin", { title: 'Sign In' })
});
 
router.get("/register",redirectIfLoggedIn, function (req, res) {
    res.render("layouts/register", { title: 'Register' })
});
router.get("/profile",redirectIfLoggedIn, function (req, res) {
    res.render("layouts/profile", { title: 'profile' })
});
 
router.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/signin');
});


module.exports = router;