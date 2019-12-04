import mysql from 'mysql';

const pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'mysql',
    user: 'root',
    password: 'password',
    database: 'Test',
    debug: false,
    multipleStatements: true
});

export async function getPoolConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }
            resolve(connection);
        })
    });
}
