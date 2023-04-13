const express = require('express')
const session = require('express-session');
const app = express()
const port = 3000
var mysql = require('mysql');

app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.set('views', './views');

let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: 'password',
  database: 'express_demo'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT * FROM users', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});

app.get('/', (req, res) => {
  const data = {
    title: 'Welcome',
    style: 'color: red',
  };
  res.render('index', data);
  // res.sendFile(__dirname + '/views/html/index.html');
}) 

app.get('/api/getuser', (req, res) => {
  res.json('{"name": "Iggy"}');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logged-in', (req, res) => {
  if (req.session.authenticated) {
    const data = {
      name: 'Iggy',
      style: 'color: red',
    }
    res.render('logged-in', data);
    // res.sendFile(__dirname + '/views/html/logged-in.html');
  }
  else {
    res.redirect('/login');
  }
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);

  connection.query(`SELECT * FROM users WHERE email='${email}' AND password='${password}'`, function (error, results, fields) {
    if (error) throw error;

    if(results.length > 0) {
      req.session.authenticated = true;
      res.redirect('/logged-in')
    }
    else {
      res.send('No users found');
    }
    console.log(results);
  });
});

app.listen(port, () => {
  console.log('listening on port ' + port);
})