const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Adicione esta linha
const flash = require('connect-flash');
const exceptionHandler = require('express-exception-handler');
const error = require('../api/middlewares/error');
const tokenCheck = require('../api/middlewares/tokenCheck');
const { protectRoutes } = require('./config');
const cors = require('cors'); // Add this line

exceptionHandler.handle();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Configuração do middleware de sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
// Use CORS to allow cross-origin requests
app.use(cors({
  origin: '*', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow credentials like cookies
}));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../api/views'));
app.use(express.static(path.join(__dirname, '../public')));

global.WhatsAppInstances = {};

// Middleware existente
const routes = require('../api/routes/');

app.use('/', routes);

app.use(error.handler);

module.exports = app;
