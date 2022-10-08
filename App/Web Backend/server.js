const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();
const { errorConverter, errorHandler } = require('./middlewares/error');
const routes = require('./routes');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');

const app = express();
app.use(cors());
connectDB();

//Init middleware
app.use(express.json({ extended: false }));
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
app.use('/api', routes);

app.use(errorConverter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
