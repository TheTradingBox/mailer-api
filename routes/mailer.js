var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var Queue = require('better-queue');
var recaptcha = require('express-recaptcha');

var data = require('../data/data');
var keys = require('../secret/keys');

recaptcha.init(keys.keys.public, keys.keys.private);

var poolConfig = {
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'jordan@thetradingbox.com',
        pass: 'tbfohxegvqcpbaof'
    }
};

var transporter = nodemailer.createTransport(poolConfig);
var queue = new Queue(function (input, cb) {
    transporter.sendMail(input, cb);
})


router.route('/:appName').post(function (req, res) {
    res.header('Access-Control-Allow-Origin', '*')
    var app = req.params.appName;
    if (app && data.data[app]) {
        verify(req, res, sendmail, data.data[app])
    } else {
        res.write('{"success": false}')
        res.status(409)
        res.end()
    }

})

var verify = function(req, res, cb, app) {
    recaptcha.verify(req, function(error) {
        if (!error) {
            console.log('Contact form submitted from ' + '. Successful captcha received. Sending mail now. ')
            cb(req, res, app)
        } else {
            console.log('Contact form submitted from ' + '. Invalid captcha received. ignoring... ')
            console.log('error code: ' + error)
            return false;
        }
    })
}

var sendmail = function(req, res, app) {
    // Create the Email

    res.write('{"success": true}')
    res.status(401)
    res.end()

    var text = 'You received a new message from ' + app.domain + "\n\n";

    Object.keys(req.body).forEach(function(item) {
        text += item + ': ' + req.body[item] + "\n\n"
    });
    //text += item + ': ' + req + "\n\n"

    var mail = {
        from: '"' + app.from +'" <' + app.fromAddress + '>',
        to: app.toAddress,
        subject: 'New Web Enquiry from ' + app.domain + ': ' + (req.body.subject ? req.body.subject : '') , // Subject line
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
