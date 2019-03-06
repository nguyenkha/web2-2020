const express = require('express');
const bodyParser = require('body-parser');
// const cookieSession = require('cookie-session');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', './views');
// app.set('view engine', 'pug');
// hoặc
app.set('view engine', 'ejs');

// app.use(cookieSession({
//   name: 'sid',
//   keys: [ 'kocokey' ],
//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));

app.use(session({
  secret: 'keyboard cat',
}))

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  const { email } = req.session;
  if (email) {
    res.send(`Xin chào ${email}`);
  } else {
    res.send(`Chào mừng đến với website!!!`);
  }
});

app.get('/sum', function (req, res) {
  res.render('sum');
});

app.post('/sum', function (req, res) {
  const n1 = Number(req.body.n1);
  const n2 = Number(req.body.n2);
  res.render('result', { result: n1 + n2 })
});

function addTodo(req, note) {
  const todos = req.session.todos = req.session.todos || [];
  todos.push({
    note,
    done: false,
  });
}

function markTodoAsDone(req, id) {
  const todos = req.session.todos = req.session.todos || [];
  if (todos[id]) {
    todos[id].done = true;
  }
}

app.get('/todo', function (req, res) {
  const todos = req.session.todos = req.session.todos || [];
  res.render('todo', { todos });
});

app.post('/todo', function (req, res) {
  addTodo(req, req.body.note);
  res.redirect('/todo');
});

app.post('/todo/:id', function (req, res) {
  const id = Number(req.params.id);
  markTodoAsDone(req, id);
  res.redirect('/todo');
});

app.get('/views', function (req, res, next) {
  req.session.views = (req.session.views || 0) + 1;
  res.send(req.session.views + ' views');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function (req, res) {
  const { email, password } = req.body;
  if (email !== 'dnkha@fit.hcmus.edu.vn' || password !== 'kocopass') {
    res.render('login');
  } else {
    req.session.email = email;
    res.redirect('/');
  }
});

app.get('/logout', function (req, res) {
  delete req.session.email;
  res.redirect('/');
});

app.listen(port, () => console.log(`TODO app listening on port ${port}!`));