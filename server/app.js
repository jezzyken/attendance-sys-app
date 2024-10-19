const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); 
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const serverRoutes = require('./routes/serverRoutes');
const AppError = require('./utils/appError');

require('dotenv').config({ path: './.env' });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

serverRoutes(app);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorHandler);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

global.__basedir = __dirname;

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
