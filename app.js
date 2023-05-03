import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from "cors";
import errorHandler from './_helpers/error.handler';

import indexRouter from './routes/index';

var app = express();

// For developement: Run the frontend app on port 8081 to access this API
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.json({ 'title': 'Node - Express - Mongo - JWT - MVC - Starter Project' });
    next(createError(404));
});

app.use('/api/auth', indexRouter);

// Catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.use(errorHandler);
// default error handler that comes with express generator - can be used instead of the above
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.json({ "error": true });
// });

export default app;
