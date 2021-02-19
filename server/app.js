const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// import mongoose
const mongoose = require('mongoose');
// import passport ที่เราติดตั้ง
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const staffRouter = require('./routes/staffs');
const productRouter = require('./routes/products');
const receiptRouter = require('./routes/receipts');
// import env
const config = require('./config/index')
// import error middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// connect mongodb
mongoose.connect(config.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.use(logger('dev'));
app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// init passport
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/staff', staffRouter);
app.use('/product', productRouter);
app.use('/receipt', receiptRouter);

// สั่งใช้งาน error middleware ที่เรา Import เข้ามา
app.use(errorHandler);

module.exports = app;