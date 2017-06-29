var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var Queue = require('better-queue');
var recaptcha = require('express-recaptcha');
var config = require('../config')

recaptcha.init(config.keys.public, config.keys.private);
var env = config.env
var transporter = nodemailer.createTransport(config.poolConfig);
var queue = new Queue(function (input, cb) {
    transporter.sendMail(input, cb);
})

router.route('*').post(function (req, res) {
    recaptcha.verify(req, function(error) {
        if (!error) {
            console.log('Contact form submitted from ' + '. Successful captcha received. Sending mail now. ')
            res.write('{"success": true}')
            res.status(200)
            res.end()
            sendmail(req, res)
        } else {
            console.log('Contact form submitted from ' + '. Invalid captcha received. ignoring... ')
            res.write('{"success": false}')
            res.status(409)
            res.end()
        }
    })
})

var sendmail = function(req, res) {
    // Create the Email
    var text = 'You received a new message from ' + env.domain + "\n\n";

    Object.keys(req.body).forEach(function(item) {
        text += item + ': ' + req.body[item] + "\n\n"
    });

    var mail = {
        from: '"' + env.from +'" <' + env.fromAddress + '>',
        to: env.toAddress,
        subject: 'New Web Enquiry from ' + env.domain + ': ' + (req.body.subject ? req.body.subject : '') , // Subject line
        text: text
    };

    // Push email to queue
    queue.push(mail, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    })
}

module.exports = router;
