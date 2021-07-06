const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

// Inicializations
const app = express(); // Inicializar aplicacion express

// Settings
app.set('port', process.env.PORT || 4000); // Configuracion de puerto de express
app.set('views', path.join(__dirname, 'views'));  // Ubicar el directorio de vistas // __dirname => ubicacion actual de este archivo
// Configurar motor de plantillas expres-handlebar
app.engine(
  '.hbs', // Nombre cualquiera para el motor
  exphbs({
    defaultLayout: 'main', // Definir el layout por default
    layoutsDir: path.join(app.get('views'), 'layout'), // Ubicar el directorio de los layouts
    partialsDir: path.join(app.get('views'), 'partials'), // Ubicar el directorio de vistas parciales
    extname: '.hbs', // Indicar cual será la extensión de las plantillas
    helpers: require('./libs/handlebars') // Para ejecutar funciones dentro de handlebars
  })
);
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(
  express.urlencoded({ // Para aceptar desde el formulario los datos de los usuario
    extended: false // Para decir que se aceptaran datos sencillos
  })
);
app.use(
    express.json({ // Configurar para aceptar json
    })
);

// Global variables
app.use((req, res, next) => {
    next();
});

// Routes
app.use(require('./routes/index.js')); // Configurar ruta principal
app.use(require('./routes/authentication.js')); // Configurar rutas para la autenticacion
app.use('/links', require('./routes/links.js')); // Configurar las rutas links con prefijo '/links'

// Public files
app.use(express.static(path.join(__dirname, 'public'))) // Indicar donde se guardaran los css, js, images, fonts

// Starting server
app.listen(app.get('port'), () => {
  console.log('Server on port ', app.get('port'));
});
