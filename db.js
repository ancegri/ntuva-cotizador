const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'ancegri'
});

pool.getConnection((err, connection)=>{
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') console.error('La conexion a la BD fue cerrada');
        if (err.code === 'ER_CON_COUNT_ERROR') console.error('La conexion a la BD tiene muchas conexiones');
        if (err.code === 'ECONNREFUSED') console.error('La conexion a la BD fue rechazada');
    } else {
        if (connection) {
            connection.release();
            console.log('La base de datos esta conectada');
            return;
        }
    }
});

pool.query = promisify(pool.query);

module.exports = pool;