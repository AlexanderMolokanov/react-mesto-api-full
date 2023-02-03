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
const { handleError } = require('./errors/handleError');
const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, MONGODB_ADDRESS } = process.env;

app.use(cors({ credentials: true, origin: true }));

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
    // useCreateIndex: true,
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
