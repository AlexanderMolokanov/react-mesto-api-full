require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('./middlewares/cors');
const { handleError } = require('./errors/handleError');
const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, MONGODB_ADDRESS } = process.env;

// const options = {
//   origin: [
//   'http://gmkv.nomoredomains.rocks',
//   'https://gmkv.nomoredomains.rocks',
//   'http://api.gmkv.nomoredomains.rocks',
//   'https://api.gmkv.nomoredomains.rocks',
//   'http://localhost:3000',
//   'https://localhost:3000',
//   'http://localhost:3001',
//   'https://localhost:3001',
//   'http://84.201.132.131',
//   'https://84.201.132.131',
//   'http://api.84.201.132.131',
//   'https://api.84.201.132.131',
//   'http://api.84.201.132.131/users/me',
//   'https://api.gmkv.nomoredomains.rocks/users/me',
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
//   credentials: true,
// };
// app.use('*', cors(options));
// app.use(cors(options))

//     app.use((req, res, next) => {
//       res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//   if (req.method === 'OPTIONS') {
//     res.send(200);
//   }
//   next();
// });

app.use(cors({ credentials: true, origin: true }));

// app.use((req, res, next) => {
//   const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
//   // проверяем, что источник запроса есть среди разрешённых
//   const { methodHttp } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
//   const requestHeaders = req.headers["access-control-request-headers"];
//   const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
//   if (allowedCors.includes(origin)) {
//     // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
//     res.header("Access-Control-Allow-Origin", origin);
//   }
//   if (methodHttp === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
//     res.header("Access-Control-Allow-Headers", requestHeaders);
//     return res.end();
//   }
//   return next();
// });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// })

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);
app.use(errorLogger);

app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use((req, res, next) => next(new NotFoundError('Маршрут не найден')));
// обработчик ошибок celebrate
app.use(errors());
// централизованная обработка ошибок
app.use((err, req, res, next) => handleError({ res, err, next }));

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  });
  app.listen(PORT, (err) => {
    if (!err) {
      console.log(`порт слушает ${PORT}!`);
    }
  });
}

main();
