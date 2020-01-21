const express = require("express");
const bodyParser = require("body-parser");
const app = express();
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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  // use res.render() to pass the URL data to our template.
  let templateVars = { urls: urlDatabase };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Route parameters - to capture the values specified at their position in the URL.
// The captured values are populated in the req.params object, with the name of the route parameter specified in the path as their respective keys
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: 'b2xVn2',
    longURL: '9sm5xK'
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:longURL", (req, res) => {
  let templateVars = {
    shortURL: 'b2xVn2',
    longURL: '9sm5xK'
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  //{ longURL: 'Hello World' }  longURL --> name in html form tag, 'Hello World' --> content
  // urlDatabase
  const randomShortURL = generateRandomString();
  const receivedLongURL = req.body.longURL;
  urlDatabase[randomShortURL] = receivedLongURL;
  console.log(urlDatabase);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(301, `/u/:${randomShortURL}`);
});

// ????????????????????????????????????????????????????
// ???  http://localhost:8080/u/b2xVn2 did not work ???
// ???  http://localhost:8080/u/:b2xVn2 working ???
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("shortURL: ", shortURL);
  console.log("urlDatabase: ", urlDatabase);
  let shortURLnoColon = '';
  for (let i = 1; i < shortURL.length; i++) {
    shortURLnoColon += shortURL[i];
  }
  // console.log("shortURLnoColon: ", shortURLnoColon);
  // console.log("urlDatabase[shortURLnoColon] "+urlDatabase[shortURLnoColon]);
  const longURL = urlDatabase[shortURLnoColon];
  console.log('longURL: ', longURL);
  res.redirect(longURL);
});

