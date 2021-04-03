
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios')
var mysql = require('mysql');

router.get('/register', (req, res) => {
  return res.render('layouts/register', {
    generate_pwd: password
  })
})
var connection = mysql.createConnection({
  host: 'freedb.tech',
  user: 'freedbtech_control',
  password: 'Ola502837571',
  database: 'freedbtech_control'
});
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post("/register", urlencodedParser, function (req, res, next) {
   
  const { name, email, password, con_pwd } = req.body
  connection.query('SELECT email FROM register WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.log(error)
    }
    if (!name || !email || !password || !con_pwd) {
      return res.render('layouts/register', {
        message2: 'Missing Required Information'
      })
    }
    else if (results.length > 0) {
      return res.render('layouts/register', {
        message: 'that email is already in use'
      })
    }
    else if (password.length <= 6) {
      return res.render('layouts/register', {
        message1: 'Password Need to be 6 Charcters'
      })
    } else if (password !== con_pwd) {
      return res.render('layouts/register', {
        message1: 'Password do not mach'
      })
    }
    const hash = bcrypt.hashSync(password, 8);
    console.log(hash)
    connection.query('INSERT INTO register SET ?', {
      name: name, email: email, password: hash, con_pwd: hash,
    }, (error, results) => {
      if (error) {
        console.log(error)
      } else {
        req.session.user = user.dataValues;
        res.render("layouts/reg_success", )
      }

    })

  })
});

router.post("/signin", urlencodedParser, async (req, res) => {  
  try {
    const {name, email, password } = req.body;
    if (!email || !password) {
      console.log(req.body);
      return res.status(400).render('layouts/signin', {
        message: 'Please provide an email and password'
      })
    }
    // connection.query('SELECT email FROM register WHERE email = ?
    connection.query('SELECT * FROM register WHERE email = ?', [email], async (error, results) => {
        
      if (!results || !(await bcrypt.compare(password, results[0].password))) {
        res.status(401).render('layouts/signin', {
          message: 'Email or password is incorrect'
        })
      } else{
        const id = results[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });
        console.log("the token is:" + token);
        const cookieOptions = {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
          httpOnly: true
        }
        console.log("llllllllll",cookieOptions);
        res.cookie('jwt', token, cookieOptions);
        res.status(200).redirect("/");
      }  
    })
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
