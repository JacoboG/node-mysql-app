const mysql = require ('mysql');
const {promisify} = require('util');

const { database } = require ('./keys');

const pool = mysql.createPool(database) // Crea un conjunto de hilos para las conexiones a mysql

pool.getConnection((err, connection) => {
    // Validaciones antes de mandar la conexion
    if (err){
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.log('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED'){
            console.log('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if (connection){
        connection.release(); // Empezar conexion

    }
    console.log('DB is Connected')
    return;
}); // Obtener conexion

// Promisify pool Queries
pool.query = promisify(pool.query);

module.exports = pool;