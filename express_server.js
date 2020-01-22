const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cookieParser = require('cookie-parser')
app.use(cookieParser());

const PORT = 8080; // default port 8080
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const generateRandomString = function() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

//http://www.localhost:8080/urls
app.get("/urls", (req, res) => {
  // use res.render() to pass the URL data to our template.
  let templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  console.log("req.cookies['username']", req.cookies["username"]);
  // console.log("req.cookies['username']", req.cookies["username"]);
  if(templateVars["username"]) {
    console.log(templateVars["username"]);
  } else {
    console.log('hi');
  }
  // console.log(templateVars[username]);
  // if (templateVars[username]) {
  //   console.log(templateVars);
  // } else if (templateVars[username] === "undefined") {
  //   console.log("no user");
  // }
 
  res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Route parameters - to capture the values specified at their position in the URL.
// The captured values are populated in the req.params object, with the name of the route parameter specified in the path as their respective keys
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    shortURL: 'b2xVn2',
    longURL: '9sm5xK'
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:longURL", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    shortURL: 'b2xVn2',
    longURL: '9sm5xK'
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  //{ longURL: 'Hello World' }  longURL --> name in html form tag, 'Hello World' --> content
  // urlDatabase
  const randomShortURL = generateRandomString();
  const receivedLongURL = req.body.longURL;
  urlDatabase[randomShortURL] = receivedLongURL;
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(301, `/u/${randomShortURL}`);
});

/* 
Add a POST route that removes a URL resource: POST /urls/:shortURL/delete
*/
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//Updating URLs
app.post("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.updateLongURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//Updating URLs
app.post("/urls/:shortURL", (req, res) => {
  // console.log("req.params.shortURL", req.params.shortURL);

  let templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});


/* 
Login Cookies
*/
app.post("/login", (req, res) => {
  console.log('req.body: ', req.body);
  console.log('Cookies: ', res.cookies);
  // res.cookie(req.body);
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

/* 
Login Cookies
*/
// app.get('/login', function (req, res) {
//   // Cookies that have not been signed
//   console.log('Cookies: ', req.cookies)

//   // Cookies that have been signed
//   console.log('Signed Cookies: ', req.signedCookies)
// })

/* 
Login Cookies
*/
app.post("/logout", (req, res) => {
  // console.log('req.body: ', req.body);
  // console.log('Cookies: ', res.cookies);
  // // res.cookie(req.body);
  // res.cookie('username', req.body.username);
  console.log('before', req.body.username);
  res.clearCookie("username");
  console.log('after', req.body.username);
  res.redirect('/urls');
  
});