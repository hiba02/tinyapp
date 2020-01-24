const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
// var cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const getUserByEmail = require ('./helpers.js');



// app.use(cookieParser());


// cookieSession example
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))






const PORT = 8080; // default port 8080
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/", (req, res) => {
  res.send("Hello!");
});

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  JslMgd: {longURL: "https://www.cnn.com", userID: "JslMgd" }
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
}







console.log(getUserByEmail("user3@example.com", users));








//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const generateRandomString = function () {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    if (i === 0) {
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    } else {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }
  return result;
};


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const urlsForUserID = function (currentCookieID) {
  const urlsUserID = urlDatabase[currentCookieID];
  console.log(urlsUserID);
  return urlsUserID;
};


// '/urls'
//http://www.localhost:8080/urls
app.get("/urls", (req, res) => {
  let currentCookieID = req.session.user_id;
  console.log('urls currentCookieID', currentCookieID);
  console.log('users ', users);
  if (users[currentCookieID]) {
    let templateVars = {
      username: req.session.user_id,
      urls: urlDatabase,
      user: currentCookieID,
      email: users[currentCookieID].email
    };
    urlsForUserID(currentCookieID);

    res.render("urls_index", templateVars);
  } else {
    console.log('currentCookieID: ', currentCookieID);
    res.redirect('/login');
  }

});


//urls_new for create New URL
app.get("/urls/new", (req, res) => {
  //if no id, go '/login'
  let currentCookieID = req.session.user_id;
  if (users[currentCookieID]) {

    let templateVars = {
      user: req.session.user_id,
      email: users[currentCookieID].email,
      urls: urlDatabase,
      shortURL: 'b2xVn2',
      longURL: '9sm5xK'
    }
    res.render("urls_new", templateVars);
  } else {
  res.redirect('/login');
  }
});


app.get("/urls/:shortURL", (req, res) => {
  let currentCookieID = req.session.user_id;
  // if current cookie user_id = urlDatabase[:shortUTR].userID
  if (users[currentCookieID] === urlDatabase[req.params.shortURL].userID) {
    let templateVars = {
      user: req.session.user_id,
      email: users[currentCookieID].email,
      shortURL: 'b2xVn2',
      longURL: '9sm5xK'
    };
    res.render("urls_show", templateVars);
  } else {
    res.redirect('/urls');
  }
});

app.get("/urls/:longURL", (req, res) => {
  let currentCookieID = req.session.user_id;  
  let templateVars = {
      user: req.session.user_id,
      email: users[currentCookieID].email,
      shortURL: 'b2xVn2',
      longURL: '9sm5xK'
    };
  res.render("urls_show", templateVars);
});


/* 
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  JslMgd: {longURL: "https://www.cnn.com", userID: "JslMgd" }
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
  },  
  "qqqMgd": {
    id: "qqqMgd",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
}

*/




// Post for create new URL
app.post("/urls", (req, res) => {
  // input = "http://www.." longURL 
  const randomShortURL = generateRandomString();
  const receivedLongURL = req.body.longURL;
  // urlDatabase[shortURL].longURL = longURL
  // urlDatabase[shortURL].userID = userID same as current cookie id
  
  // urlDatabase[randomShortURL].longURL = receivedLongURL;
  let currentCookieID = req.session.user_id;
  // urlDatabase[randomShortURL].userID = currentCookieID;

  urlDatabase[randomShortURL] = {
    longURL: receivedLongURL,
    userID: currentCookieID
  };
  res.redirect(`/urls`);
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
  urlDatabase[req.params.shortURL].longURL = req.body.updateLongURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//Updating URLs
app.post("/urls/:shortURL", (req, res) => {
  // console.log("req.params.shortURL", req.params.shortURL);
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

// made a comment 1.22 8:27
/* 
Login Cookies 
*/
// app.post("/login", (req, res) => {
//   console.log('req.body: ', req.body);
//   console.log('Cookies: ', res.cookies);
//   // res.cookie(req.body);
//   res.cookie('username', req.body.username);
//   res.redirect('/urls');
// });

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

  console.log('before', req.body.username);
  req.session = null;
  console.log('after', req.body.username);
  res.redirect('/urls');
});




// register - GET
app.get("/register", (req, res) => {
  let currentCookieID = req.session.user_id;
  if (users[currentCookieID]) {
    
    console.log('req.session.user_id', req.session.user_id);
    console.log('users', users);
    let templateVars = {
      user: req.session.user_id,
      email: users[currentCookieID].email,
      urls: urlDatabase
    }
    res.render("urls_register", templateVars);
  } else {
    let templateVars = {
      user: false,
      email: null,
      urls: urlDatabase
    }
    res.render("urls_register", templateVars);
  }

  
});


/* 
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
*/

//bcrypt.hashSync(req.body.password, 10)


// register - POST
// produce new user ID and put it in usrs object
// send cookie with new user ID
// if -> check email exist or not
app.post("/register/process", (req, res) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  if (!req.body.email || !hashPassword) {
    console.log(req.body.email);
    return res.status(404).send(`<h1>Please enter email and password.</h1>`);
  }
  let user_id = generateRandomString();
  let newUser;
  newUser = {
    id: user_id,
    email: req.body.email,
    password: hashPassword
  }
  users[user_id] = newUser;
  console.log(users);
  
  // Send user_id as cookie to browser (fixed to cookie-session)
  // res.cookie('user_id', user_id);
  req.session.user_id = user_id;  
  res.redirect("/urls");
});

/* login GET */
app.get("/login", (req, res) => {
  const loggedEmail = req.body.email;
  const loggedPassword = req.body.password
  let templateVars = {
    user: loggedEmail,
    urls: loggedPassword
  };
  console.log("templateVars", templateVars);

  res.render("urls_login", templateVars);   
  
});

/* login POST - Update the Login Handler
match email address
*/
app.post("/login", (req, res) => {
  // hash
  
  const hashPassword = bcrypt.hashSync(req.body.password, 10);
  if (!req.body.email || !hashPassword) {
    console.log(req.body.email);
    return res.status(404).send(`<h2>Please enter email and password.</h2>`);
  }
  console.log('req.body.email, req.body.password', req.body.email, hashPassword)
  console.log('/login Post usrs: ', users);
  let loggedUserId = '';
  for (const eachUsr in users) {
    // eq.body.password commes from user input (form tag)  
    if (users[eachUsr].email === req.body.email && bcrypt.compareSync(req.body.password, users[eachUsr].password)) {
      loggedUserId = eachUsr;
    }
  }
  if (!loggedUserId) {
    // return res.status(403).send(`<h1>Please enter email and password.</h1>`);
    return res.status(403).send('<h2>Not matched passward<h2>');
  }
  //changed cookie parser to cookie session
  // res.clearCookie("user_id");
  req.session.user_id = null;
  //res.cookie('user_id', loggedUserId);
  req.session.user_id = loggedUserId;
  res.redirect("/urls");

});