// npm programs
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// initializing npm programs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());

// URL Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

// displays home page with short and longURLS
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});

// create new login URL page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  }
  res.render("urls_new", templateVars);
});

// will read anything in browser urls/""/ and make a href link out of it
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});

// redirects shortURL links to longURL page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.render("login", templateVars);
});
app.get("/register", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.render("register", templateVars);
});

// creates new custom shortURL for given longURL
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL
  longURL = req.body.longURL
  res.redirect(`/urls/${shortURL}`);
});

// deletes a URL from database
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// updates URL from database
app.post("/urls/:shortURL", (req, res) => {
 const shortURL = req.params.shortURL;
 const newURL = req.body.name;
 urlDatabase[shortURL] = newURL;
 res.redirect("/urls");
});

// username login
app.post("/login", (req, res) => {
  if (users[req.body.username]) {
    if (users[req.body.username].password=== req.body.password) {
      res.cookie("username", req.body.username);
      res.redirect("/urls")
    } else if (users[req.body.username].password !== req.body.password) {
      res.redirect("/login")
    }
  } else if (users[req.body.username] !== req.body.username) {
    res.redirect("/register")
  }
});

// Register New User/ Create Custom ID
app.post("/register", (req, res) => {
  let newID = generateRandomString();



  users[newID] = {
    id : newID,
    email : "",
    password : "",
  };
  console.log(users);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls")
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString () {
  let randomString = Math.random().toString(36).slice(-6);
    return randomString;
}