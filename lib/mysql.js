var Client = require('mysql').Client, client = new Client();

module.exports.connect = function(host, port, user, password, database) {
  client.host = host;
  client.port = port;
  client.user = user;
  client.password = password;
  client.database = database;
  client.connect();
};
module.exports.register = function(user, pass, email, cb) {
  client.query('INSERT INTO user ' + 'SET user = ?, pass = ?, email = ?', [ user, pass, email ], function(err, info) {
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
};
module.exports.login = function(user, pass, cb) {
  client.query('SELECT * FROM user WHERE user = ?', [ user ], function(err, results, fields) {
    if (err) {
      cb(false);
    } else {
      if (results.length > 0 && results[0]['pass'] == pass) {
        cb(true);
      } else {
        cb(false);
      }
    }
  });
};
module.exports.find = function(user, cb) {
  client.query('SELECT * FROM user WHERE user = ?', [ user ], function(err, results, fields) {
    if (err) {
      cb(err);
    } else {
      cb(results);
    }
  });
};
module.exports.find_by_mobile = function(mobile, cb) {
  client.query('SELECT count(*) as CNT FROM user WHERE mobile = ?', [ mobile ], function(err, results, fields) {
    if (err) {
      cb(-1);
    } else {
      cb(results[0]['CNT']);
    }
  });
};
module.exports.bind = function(user, mobile) {
  client.query('UPDATE user SET mobile = ? WHERE user = ?', [ mobile, user ]);
};
module.exports.cancel_bind = function(mobile) {
  client.query('UPDATE user SET mobile = NULL WHERE mobile = ?', [ mobile ]);
};
module.exports.update_pass = function(user, newpasswd, cb) {
  client.query('UPDATE user SET pass = ? WHERE user = ?', [ newpasswd, user ], function(err, results, fields) {
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
};
module.exports.guidbind = function(guid, mobile, cb) {
  client.query('INSERT INTO guidmobile ' + 'SET guid = ?, mobile = ?', [ guid, mobile ], function(err, info) {
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
};