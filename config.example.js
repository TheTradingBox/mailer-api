// Port settings for dev and prod
exports.ports = {
  http: exports.isProd ? 80 : 9100,
  https: exports.isProd ? 80 : 9100
}

// Google Site and Private keys for captcha
exports.keys = {
    private:  '6LfoSycUAAAAABnRy6btOHaUGqRTNG1aUAJuxjkB',
    public: '6LfoSycUAAAAAPJ-YaW7iR0vxjmusqbVNkVpTust'
}

// Destination for forms to email
exports.configs = {
    dev : {domain: 'local.gdaydigitalnomads.com', toAddress: 'jordan@thetradingbox.com', fromAddress: 'jordan@thetradingbox.com', from: 'Jordan Rancie'},
    production : { domain: 'www.gdaydigitalnomads.com', toAddress: 'jordan@thetradingbox.com', fromAddress: 'jordan@thetradingbox.com', from: 'Jordan Rancie'}
}
exports.env = (process.env.NODE_ENV === 'production') ? exports.configs.production : exports.configs.dev

exports.poolConfig = {
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'jordan@thetradingbox.com',
        pass: 'tbfohxegvqcpbaof'
    }
};