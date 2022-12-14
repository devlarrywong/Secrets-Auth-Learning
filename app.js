//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB', (err) => {
  if (!err) {
    console.log('Successfully Connect to MongoDB');
  } else {
    console.log(err);
  }
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password'],
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (!err) {
      res.render('secrets');
      console.log('Successfully to add an user to mongodb');
    } else {
      console.log(err);
    }
  });

  console.log(req.body);
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (foundUser) {
      console.log(foundUser);
      if (req.body.password === foundUser.password) {
        res.render('secrets');
      } else {
        console.log('username or password are incorrect, please try again!');
        res.redirect('login');
      }
    } else {
      console.log('Entered Detail is not found');
    }
  });
});

app.listen('3000', (err) => {
  if (!err) {
    console.log('Server started on port 3000');
  }
});
