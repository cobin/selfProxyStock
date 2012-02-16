var nodemailer = require('nodemailer');
nodemailer.sendmail = '/usr/sbin/sendmail';

module.exports.send_password_mail = function(user,email,passwd,cb) {
  var subject = '找回密码-手机证券';
  var body = "亲爱的用户："+user+"您好！ \r\n为您分配的新密码是"+passwd+"，您可以继续享受手机证券带来的极速行情和安全交易。";
  nodemailer.SMTP = {
      host: 'mail.netgen.com.cn',
      user: 'sjchen', 
      pass: 'llj800218csj' 
  };
  
  nodemailer.send_mail({
    sender: "手机证券<noreply@netgen.com.cn>",
    to:email,
    subject:subject,
    body:body
  }, function(error, success) {
    cb(success);
  });
};