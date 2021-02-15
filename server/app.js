const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// import mongoose
const mongoose = require('mongoose');
// import env
const config = require('./config/index')

// import error middleware
const errorHandler = require('./middleware/errorHandler');
// import passport ที่เราติดตั้ง
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const staffRouter = require('./routes/staffs');
const productRouter = require('./routes/products');
const receiptRouter = require('./routes/receipts');

const app = express();

// connect mongodb
mongoose.connect(config.MONGO_DB,{
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