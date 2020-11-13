//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


var fs = require('fs');
var path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var dogAdoptionstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dogimguploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({
  storage: storage
});

var dogadoptionupload = multer({
  storage: dogAdoptionstorage
});


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin:admin@cluster0.dbo9h.mongodb.net/PostsDB", {useNewUrlParser : true});

// mongoose.connect("mongodb://localhost:27017/PawBeingDB", {
//   useNewUrlParser: true
// });
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  firstname: String,
  lastname: String,
  dob: {
    type: Date,
    default: Date.now
  },
  contact: {
    type: Number
  },
  password: String,
  googleId: String,
  secret: String
});

// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
//
// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);
//
//     User.findOrCreate({
//       googleId: profile.id
//     }, function(err, user) {
//       return cb(err, user);
//     });
//   }
// ));
//

var imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  username: String,
  creationdate: {
    type: Date,
    default: Date.now
  },
  img: {
    data: Buffer,
    contentType: String
  }
});

var adoptionSchema = new mongoose.Schema({
  "dogName": String,
  "breed": String,
  "gender": String,
  "age": String,
  "color": String,
  "health": String,
  "state": String,
  "city": String,
  "image": {
    "data": Buffer,
    "contentType": String,
  },
  "isGoodWith":{
		"otherDogs": String,
		"otherCats": String,
    "Childrens": String,
	},
  "otherDetails": String,
  "PostTime": Date,
  "Status": String,
  "AdoptionTime": Date,
  "AdoptedBy": String,
  "AdoptionCity": String,
});
//Image is a model which has a schema imageSchema

const imgModel = new mongoose.model("Image", imageSchema);
const dogModel = new mongoose.model("dogAdoptionpost", adoptionSchema);

// Retriving the image
app.get('/blogs', (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      res.render('blogs', {
        items: items
      });
    }
  });
});

app.get('/aboutdogadoption', (req, res) => {
  res.render('aboutdogadoption')
});

app.post('/dogadoptionpost', dogadoptionupload.single('image'), (req, res, next) => {
  var obj = {
    dogName: req.body.dogname,
    breed: req.body.breed,
    gender: req.body.gender,
    age: req.body.age,
    color: req.body.color,
    health: req.body.health,
    state: req.body.state,
    city: req.body.city,
    image: {
      data: fs.readFileSync(path.join(__dirname + '/dogimguploads/' + req.file.filename)),
      contentType: 'image/png',
    },
    isGoodWith: {
      otherDogs: req.body.otherdogs,
      otherCats: req.body.othercats,
      Childrens: req.body.children,
    },
    otherDetails: req.body.otherdetails,
    PostTime: new Date().toLocaleDateString(),
    Status: "ReadyForAdoption",
    AdoptionTime: "",
    AdoptedBy: "",
    AdoptionCity: "",
  };
  dogModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/secrets');
    }
  });
});

app.post('/img', upload.single('image'), (req, res, next) => {
  // Uploading the image
  console.log("In blog " + req.body.name);
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    username: "Prakhar",
    creationdate: new Date().toLocaleDateString(),
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  console.log(obj.img.data);
  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect('/secrets');
    }
  });
});

app.get("/", function(req, res) {
  res.render("login");
});

app.get("/profile", function(req, res) {
  res.render("profile");
});

// app.get("/auth/google",
//   passport.authenticate('google', {
//     scope: ["profile"]
//   })
// );

// app.get("/auth/google/secrets",
//   passport.authenticate('google', {
//     failureRedirect: "/login"
//   }),
//   function(req, res) {
//     // Successful authentication, redirect to secrets.
//     res.redirect("/secrets");
//   });

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/secrets", function(req, res) {

  User.find({
    "secret": {
      $ne: null
    }
  }, function(err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        dogModel.find({}, (err, items) => {
          if (err) {
            console.log(err);
          } else {
            res.render('secrets', {
              items: items,
                usersWithSecrets: foundUsers
            });
          }
        });
        // res.render("secrets", {
        //   usersWithSecrets: foundUsers
        // });
      }
    }
  });
});

app.get("/submit", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", function(req, res) {
  const submittedSecret = req.body.secret;

  //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  // console.log(req.user.id);

  User.findById(req.user.id, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function() {
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res) {

  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    // console.log(username+" "+req.body.password);
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });

});

app.post("/login", function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });

});



app.listen(process.env.PORT || 3001, function(){
  console.log("Server Started Successfully");
});
