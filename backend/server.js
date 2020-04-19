const express = require('express');
const connectDb = require('./dbConn/db');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

//// APP ////
const app = express();
connectDb();

//// MIDDLEWARE ////
app.use(morgan('dev'));
app.use(express.json({extended:false}))
app.use(bodyParser.json());
app.use(cookieParser());

//// CORS ////
if (process.env.NODE_ENV === 'development') {
    app.use(cors({origin: `${process.env.CLIENT_URL}`}));
}

//// ROUTES MIDDLEWARE ////
app.use('/api',require('./routes/blogRoute'));
app.use('/api',require('./routes/authRoute'));
app.use('/api',require('./routes/userRoute'));
app.use('/api',require('./routes/categoryRoute'));
app.use('/api',require('./routes/tagsRoute'));

//// PORT ////
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port : ${port}`)
});
