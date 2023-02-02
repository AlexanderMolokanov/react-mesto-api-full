// const allowedCors = [
//   'http://gmkv.nomoredomains.rocks',
//   'https://gmkv.nomoredomains.rocks',
//   'http://api.gmkv.nomoredomains.rocks',
//   'https://api.gmkv.nomoredomains.rocks',
//   'http://localhost:3000',
//   'https://localhost:3000',
//   'http://localhost:3001',
//   'http://localhost:3000/users/me',
//   'https://localhost:3001',
//   'http://84.252.128.231',
//   'https://84.252.128.231',
//   'http://api.84.252.128.231',
//   'https://api.84.252.128.231',
//   'http://api.84.252.128.231/users/me',
//   'https://api.gmkv.nomoredomains.rocks/users/me',
// ];

// const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// module.exports = (req, res, next) => {

//   const { origin } = req.headers;
//   const { method } = req;
//   const requestHeaders = req.headers['access-control-request-headers'];
//   res.header('Access-Control-Allow-Credentials', true);
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     res.end();
//   }
//   next();
// };

// class NotFoundError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'NotFoundError';
//     this.statusCode = 404;
//   }
// }

// module.exports = NotFoundError;
