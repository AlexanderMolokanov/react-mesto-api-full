require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const helmet = require('helmet');
// const cors = require('./middlewares/cors');
const cors = require('cors');
const { handleError } = require('./errors/handleError');
const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000, NODE_ENV, MONGODB_ADDRESS  } = process.env;
const options = {
  origin: [
  'http://gmkv.nomoredomains.rocks',
  'https://gmkv.nomoredomains.rocks',
  'http://api.gmkv.nomoredomains.rocks',
  'https://api.gmkv.nomoredomains.rocks',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
  'http://84.201.132.131',
  'https://84.201.132.131',
  'http://api.84.201.132.131',
  'https://api.84.201.132.131',
  'http://api.84.201.132.131/users/me',
  'https://api.gmkv.nomoredomains.rocks/users/me',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};
app.use('*', cors(options));
// app.use(cors(options))
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
// app.use(cors);
app.use(requestLogger);

app.use(limiter);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// mongoose.set('strictQuery', false);
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
  await mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS: 'mongodb://localhost:27017/mestodb');
  app.listen(PORT, (err) => {
      if (!err) {
        console.log(`порт слушает ${PORT}!`);
      }
    });
}

main();
