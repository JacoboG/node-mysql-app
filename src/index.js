const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const { database } = require("./keys");
const passport = require("passport");

// Inicializations
const app = express(); // Inicializar aplicacion express
require ('./libs/passport');

// Settings
app.set("port", process.env.PORT || 4000); // Configuracion de puerto de express
app.set("views", path.join(__dirname, "views")); // Ubicar el directorio de vistas // __dirname => ubicacion actual de este archivo
// Configurar motor de plantillas expres-handlebar
app.engine(
  ".hbs", // Nombre cualquiera para el motor
  exphbs({
    defaultLayout: "main", // Definir el layout por default
    layoutsDir: path.join(app.get("views"), "layouts"), // Ubicar el directorio de los layouts
    partialsDir: path.join(app.get("views"), "partials"), // Ubicar el directorio de vistas parciales
    extname: ".hbs", // Indicar cual será la extensión de las plantillas
    helpers: require("./libs/handlebars"), // Para ejecutar funciones dentro de handlebars
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(session({
  secret: 'ojgmysqlnodesession',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    // Para aceptar desde el formulario los datos de los usuario
    extended: false, // Para decir que se aceptaran datos sencillos
  })
);
app.use(
  express.json({
    // Configurar para aceptar json
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  next();
});

// Routes
app.use(require("./routes/index.js")); // Configurar ruta principal
app.use(require("./routes/authentication.js")); // Configurar rutas para la autenticacion
app.use("/links", require("./routes/links.js")); // Configurar las rutas links con prefijo '/links'

// Public files
app.use(express.static(path.join(__dirname, "public"))); // Indicar donde se guardaran los css, js, images, fonts

// Starting server
app.listen(app.get("port"), () => {
  console.log("Server on port ", app.get("port"));
});
