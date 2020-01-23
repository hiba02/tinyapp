const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cookieParser = require('cookie-parser')
app.use(cookieParser());

const PORT = 8080; // default port 8080
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

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



//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const generateRandomString = function () {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//http://www.localhost:8080/urls
app.get("/urls", (req, res) => {
  let currentCookieID = req.cookies["user_id"];
  console.log('urls currentCookieID', currentCookieID);
  if (currentCookieID) {
    let templateVars = {
      username: req.cookies["user_id"],
      urls: urlDatabase,
      user: currentCookieID,
      email: users[currentCookieID].email
    };
    console.log('currentCookieID:  ', currentCookieID);
    console.log("/ruls req.body ", users[currentCookieID]);
    console.log("req.cookies[user_id].email", users[currentCookieID].email);
    res.render("urls_index", templateVars);
  } else {
    console.log('currentCookieID: ', currentCookieID);
    res.redirect('/register');
  }
  
  //console.log('users', users)
  //console.log('users[currentCookieID].email', users[currentCookieID].email)


  // if(templateVars["username"]) {
  //   console.log(templateVars["username"]);
  // } else {
  //   console.log('hi');
  // }

});


//urls_new for create New URL
app.get("/urls/new", (req, res) => {
  // let currentCookieID = req.cookies["user_id"];
  // let templateVars = {
  //   user: req.cookies["user_id"],
  //   email: users[currentCookieID].email,
  //   shortURL: 'b2xVn2',
  //   longURL: '9sm5xK'
  // };
  // res.render("urls_new", templateVars);

  if (req.cookies["user_id"]) {
    let currentCookieID = req.cookies["user_id"];
    let templateVars = {
      user: req.cookies["user_id"],
      email: users[currentCookieID].email,
      urls: urlDatabase,
      shortURL: 'b2xVn2',
      longURL: '9sm5xK'
    }
    res.render("urls_new", templateVars);
  } else {
    let templateVars = {
      user: false,
      email: null,
      urls: urlDatabase,
      shortURL: 'b2xVn2',
      longURL: '9sm5xK'
    }
    res.render("urls_new", templateVars);
  }


});


app.get("/urls/:shortURL", (req, res) => {
  let currentCookieID = req.cookies["user_id"];
    let templateVars = {
      user: req.cookies["user_id"],
      email: users[currentCookieID].email,
      shortURL: 'b2xVn2',
      longURL: '9sm5xK'
    };
    res.render("urls_show", templateVars);
});

app.get("/urls/:longURL", (req, res) => {
  let currentCookieID = req.cookies["user_id"];  
  let templateVars = {
      user: req.cookies["user_id"],
      email: users[currentCookieID].email,
      shortURL: 'b2xVn2',
      longURL: '9sm5xK'
    };
  res.render("urls_show", templateVars);
});


// Post for create new URL
app.post("/urls", (req, res) => {

  const randomShortURL = generateRandomString();
  const receivedLongURL = req.body.longURL;
  urlDatabase[randomShortURL] = receivedLongURL;

  console.log("randomShortURL ", randomShortURL);
  console.log("receivedLongURL  ", receivedLongURL);
  console.log("urlDatabase[randomShortURL]  ", urlDatabase[randomShortURL]);

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
  // console.log('req.body: ', req.body);
  // console.log('Cookies: ', res.cookies);
  // // res.cookie(req.body);
  // res.cookie('username', req.body.username);
  //const user_id = req.cookies["user_id"];
  console.log('before', req.body.username);
  res.clearCookie("user_id");
  console.log('after', req.body.username);
  res.redirect('/urls');

});




// register - GET
app.get("/register", (req, res) => {
  if (req.cookies["user_id"]) {
    let currentCookieID = req.cookies["user_id"];
    let templateVars = {
      user: req.cookies["user_id"],
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



  // if (templateVars["user_id"]) {
  //   console.log(templateVars["user_id"]);
  // } else {
  //   console.log('hi');
  // }
  
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

// register - POST
// produce new user ID and put it in usrs object
// send cookie with new user ID
// if -> check email exist or not
app.post("/register/process", (req, res) => {
  if (!req.body.email || !req.body.password) {
    console.log(req.body.email);
    return res.status(404).send(`<h1>Please enter email and password.</h1>`);
  }

  let user_id = generateRandomString();
  let newUser;
  newUser = {
    id: user_id,
    email: req.body.email,
    password: req.body.password
  }

  users[user_id] = newUser;
  console.log(users);
  res.cookie('user_id', user_id);

  // for (let eachUsr in users) {
  //   console.log(users[eachUsr].email);
  //   if (users[eachUsr].email === req.body.email) {

  //   }
  // }

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
  
  
  // if (req.cookies["user_id"]) {
  //   const currentCookieID = req.cookies["user_id"];
    
  //   console.log('login currentCookieID', currentCookieID);
  //   console.log('login users', users);
  //   const currentEmail = users[currentCookieID].email
    // let user_id = generateRandomString();
    // let newUser;
    // newUser = {
    //   id: user_id,
    //   email: req.body.email,
    //   password: req.body.password
    // }
    
  //   const templateVars = {
  //     username: req.cookies["user_id"],
  //     user: currentCookieID,
  //     email: currentEmail
  //   };
  //   console.log('login currentCookieID', currentCookieID);
  //   console.log('currentCookieID:  ', currentCookieID);
  //   console.log("/login req.body ", users[currentCookieID]);
  //   console.log("req.cookies[user_id].email", users[currentCookieID].email);
  //   console.log("/login templateVar", templateVars);
  //   res.render("urls_login", templateVars);
  // } else {
  //   console.log('login GET else req.cookies["user_id"]: ', req.cookies["user_id"]);
  //   res.redirect("urls_login");
  // }
});



/* login POST - Update the Login Handler
match email address
*/
app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    console.log(req.body.email);
    return res.status(404).send(`<h2>Please enter email and password.</h2>`);
  }
  console.log('req.body.email, req.body.password', req.body.email, req.body.password)
  console.log('/login Post usrs: ', users);
  let loggedUserId = '';
  for (const eachUsr in users) {  
    if (users[eachUsr].email === req.body.email && users[eachUsr].password === req.body.password) {
      loggedUserId = eachUsr;
    }
  }
  if (!loggedUserId) {
    // return res.status(403).send(`<h1>Please enter email and password.</h1>`);
    return res.status(403).send('<h2>Not matched passward<h2>');
  }
  res.clearCookie("user_id");
  res.cookie('user_id', loggedUserId);

  // const templateVars = {
  //   user_id: req.cookies["user_id"],
  //   user: users[loggedUserId],
  //   email: users[loggedUserId].email
  // };

  // console.log(templateVars);
  res.redirect("/urls");
  // users[user_id] = newUser;
  // console.log(users);
  // res.cookie('user_id', user_id);

  // for (let eachUsr in users) {
  //   console.log(users[eachUsr].email);
  //   if (users[eachUsr].email === req.body.email) {

  //   }
  // }
});