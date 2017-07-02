// Port settings for dev and prod
exports.isProd = process.env.NODE_ENV === 'production'
exports.ports = 9100

// Google Site and Private keys for captcha
exports.keys = {
    private:  '',
    public: ''
}

// Destination for forms to email
exports.configs = {
    dev : {domain: 'local.example.com', toAddress: 'test@example.com', fromAddress: 'test@example.com', from: 'My Name'},
    production : { domain: 'www.example.com', toAddress: 'test@texample.com', fromAddress: 'test@example.com', from: 'My Name'}
}
exports.env = exports.isProd ? exports.configs.production : exports.configs.dev

exports.poolConfig = {
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'me@gmail.com',
        pass: 'password'
    }
};