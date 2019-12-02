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
    database: 'react-test',
    debug: false
});

async function getPoolConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                res.json({
                    "code": 100,
                    "status": "Error in connection database"
                });
                reject();
            }
            resolve(connection);
        })
    });
}

async function createTable(req, res) {
    try {
        const connection = await getPoolConnection();
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
        const connection = await getPoolConnection();
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
        const connection = await getPoolConnection();
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
async function getUsersThroughStoredProcedure() {

}


app.get("/createTable", (req, res) => {
    createTable(req, res);
})

app.get("/getAllUsers", function (req, res) {
    getAllUsers(req, res);
});

app.route("/insertNewUser").post(bodyParser.json(), function (req, res) {
    insertNewUser(req, res);
});

app.get("getUsersThroughStoredProcedure", (req, res) => {
    return getUsersThroughStoredProcedure(req, res);
})


app.listen(3000);