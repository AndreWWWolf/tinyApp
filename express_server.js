const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// displays home page with short and longURLS
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase };
    console.log("i am two");
  res.render("urls_index", templateVars);
});
// create new login URL page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
  console.log("i am five");
});
// creates new custom shortURL for given longURL
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL
    longURL = req.body.longURL
    console.log("i am four")
  res.redirect(`/urls/${shortURL}`);
});

// will read anything in browser urls/""/ and make a href link out of it
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] };
    console.log("i am one");
  res.render("urls_show", templateVars);
});

// redirects shortURL links to longURL page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log("i am three");
  console.log(longURL);
  res.redirect(longURL);
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString () {
  let randomString = Math.random().toString(36).slice(-6);
    return randomString;
}