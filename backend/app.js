require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const helmet = require('helmet');
const cors = require('./middlewares/cors');
// const cors = require('cors');
const { handleError } = require('./errors/handleError');
const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000 } = process.env;

// const options = {
//   origin: [
//     'http://localhost:3000',
//     'http://localhost:3001',
//     'http://localhost:3001/users/me',
//     'https://gmkv.nomoredomains.work',
//     'https://gmkvam.nomoredomains.work',
//     'http://gmkv.nomoredomains.work',
//     'http://gmkvam.nomoredomains.work',
//     'https://gmkv.nomoredomains.work/users/me',
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
//   credentials: true,
// };
// app.use('*', cors(options));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors);
app.use(requestLogger);

app.use(limiter);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

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

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`порт слушает ${PORT}!`);
  }
});
