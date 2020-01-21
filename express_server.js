const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

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

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

 app.get("/urls", (req, res) => {
  // use res.render() to pass the URL data to our template.
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
//Route parameters - to capture the values specified at their position in the URL. 
// The captured values are populated in the req.params object, with the name of the route parameter specified in the path as their respective keys
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: 'b2xVn2', longURL: '9sm5xK' };
  console.log(req.params.shortURL);
  console.log(templateVars.shortURL);
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.get("/urls/:longURL", (req, res) => {
  let templateVars = { shortURL: 'b2xVn2', longURL: '9sm5xK' };
  console.log(req.params.shortURL);
  console.log(templateVars.shortURL);
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

