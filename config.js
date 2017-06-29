exports.isProd = process.env.NODE_ENV === 'production'
exports.host = exports.isProd && '127.0.0.1'
exports.ports = {
  http: exports.isProd ? 1113 : 9100,
  https: exports.isProd ? 443 : 9101
}
