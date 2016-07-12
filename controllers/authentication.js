const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function getToken(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  res.send({ token: getToken(req.user)});
}

exports.signup = function(req, res, next) {
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password)
    return res.status(422).send({ error: 'pls provide email & pass thx'});

  User.findOne({ email: email}, function(err, user) {
    if(err) { return next(err); }

    if(user) {
      return res.status(422).send({ error: "Email already exists"});
    }

    const newUser = new User({
      email: email,
      password: password
    })

    newUser.save(function(err) {
      if(err) { return next(err); }
      res.json({ token: getToken(newUser) });
    });
  })
}
