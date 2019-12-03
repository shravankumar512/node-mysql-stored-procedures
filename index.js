var express = require("express");
var mysql = require('mysql');
var bodyParser = require('body-parser')
var cors = require('cors')

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())
app.use(cors())


var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'mysql',
    user: 'root',
    password: 'password',
    database: 'Test',
    debug: false,
    multipleStatements: true
});

async function getPoolConnection(req, res) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                res.json({
                    "code": 100,
                    "status": "Error in connection database"
                });
                reject();
            }
            console.log('----------------->');

            resolve(connection);
        })
    });
}

async function createTable(req, res) {
    try {
        const connection = await getPoolConnection(req, res);
        console.log('connected as id ' + connection.threadId);
        connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT,
            full_name VARCHAR(150)
        )`, function (err, rows) {
            connection.release();
            if (err) {
                res.json(err);
            }
            res.json(rows)
        });
    } catch (error) {
        console.log({
            error
        })
        res.json({
            error
        })
    }
}

async function getAllUsers(req, res) {
    try {
        const connection = await getPoolConnection(req, res);
        console.log('connected as id ' + connection.threadId);
        connection.query("select * from users", function (err, rows) {
            connection.release();
            if (err) {
                res.json(err);
            }
            res.json(rows)
        });
    } catch (error) {
        console.log({
            error
        })
    }
}

async function insertNewUser(req, res) {
    try {
        let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
        let query = mysql.format(insertQuery, ["users", "id", "full_name", req.body.id, req.body.full_name]);
        const connection = await getPoolConnection(req, res);
        console.log('insertNewUser as id ' + connection.threadId);
        connection.query(query, function (err, rows) {
            // pool.query(query, (err, response) => {
            if (err) {
                console.error(err);
                res.json({
                    err
                })
            }
            // rows added
            res.json({
                rows
            })
        });
    } catch (error) {
        console.log({
            error
        })
    }
}

async function getUsersThroughStoredProcedure(req, res) {
    const connection = await getPoolConnection(req, res);
    try {
        let sql = `CALL sp_getAllUsers()`;
        console.log('connected as id ' + connection.threadId);
        connection.query(sql, true, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            console.log(results[0]);
            res.json(results[0])
        });
    } catch (error) {
        console.log({
            error
        })
    } finally {
        await connection.release();
    }
}

async function insertUserThroughSP(req, res) {
    const connection = await getPoolConnection(req, res);
    try {
        let query = `SET @userId = 0; CALL sp_insertUser(@userId, ${req.body.id}, "${req.body.full_name}"); SELECT @userId;`;
        console.log('connected as id ' + connection.threadId);
        connection.query(query, true, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            console.log(results[2]);
            res.json(results[2])
        });

    } catch (error) {
        console.log({
            error
        });
    } finally {
        await connection.release();
    }
}

async function updateUserThroughSP(req, res) {
    const connection = await getPoolConnection(req, res);
    try {
        let query = `SET @userId = 0; CALL sp_updateUser(@userId, ${req.body.id}, "${req.body.full_name}"); SELECT @userId;`;
        console.log('connected as id ' + connection.threadId);
        connection.query(query, true, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            console.log(results[2]);
            res.json(results[2])
        });

    } catch (error) {
        console.log({
            error
        });
    } finally {
        await connection.release();
    }
}




app.get("/createTable", (req, res) => {
    createTable(req, res);
})

app.get("/getAllUsers", function (req, res) {
    getAllUsers(req, res);
});

app.get("/getUsersThroughStoredProcedure", (req, res) => {
    getUsersThroughStoredProcedure(req, res);
})

app.route("/insertUserThroughSP").post(bodyParser.json(), function (req, res) {
    insertUserThroughSP(req, res);
});
app.route("/updateUserThroughSP").put(bodyParser.json(), function (req, res) {
    updateUserThroughSP(req, res);
});
app.route("/insertNewUser").post(bodyParser.json(), function (req, res) {
    insertNewUser(req, res);
});

let server = null
new Promise((resolve, reject) => {
    server = app.listen(3000, '0.0.0.0', error => {
        if (error) {
            server = null
            reject(error);
            return;
        }
        resolve();
    });
});

process.on('SIGTERM', () => {
    app.set('HEALTH_STATUS', 'SHUTTING_DOWN');
    setTimeout(() => {
        server.close(() => {
            console.log('Shutdown Complete.');
            process.exit(0);
        });
    }, 3000);
});