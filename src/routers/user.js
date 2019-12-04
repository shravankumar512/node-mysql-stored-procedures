import {
    Router
} from 'express';
const router = new Router();
import {
    getPoolConnection
} from '../config'

async function genericFunction(query) {
    let connection;
    try {
        connection = await getPoolConnection();
        console.log('connected as id ' + connection.threadId);
        return new Promise((resolve, reject) => {
            connection.query(query, true, (error, results, fields) => {
                if (error) {
                    console.error(error.message);
                    reject(error)
                }
                resolve(results);
            });
        })
    } catch (error) {
        console.log({
            error
        })
    } finally {
        await connection.release();
    }
}

async function getUsersThroughStoredProcedure(req, res) {
    try {
        const query = `CALL sp_getAllUsers()`;
        const result = await genericFunction(query);
        res.json(result[0])
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}

async function getUserById(req, res) {
    try {
        let query = `CALL sp_getUserById(${req.body.id});`;
        const result = await genericFunction(query);
        res.json(result[0]);
    } catch (error) {
        res.json({
            error
        })
    }
}

async function insertUserThroughSP(req, res) {
    try {
        let query = `CALL sp_insertUser(${req.body.id}, "${req.body.full_name}");`;
        const result = await genericFunction(query);
        res.json(result[0]);
    } catch (error) {
        res.json({
            error
        })
    }
}

async function updateUserThroughSP(req, res) {
    try {
        let query = `CALL sp_updateUser(${req.body.id}, "${req.body.full_name}")`;
        const result = await genericFunction(query);
        res.json(result[0]);
    } catch (error) {
        res.json({
            error
        })
    }
}

router.get("/getUsersThroughStoredProcedure", (req, res) => {
    getUsersThroughStoredProcedure(req, res);
})

router.post("/getUserById", (req, res) => {
    getUserById(req, res);
});

router.post("/insertUserThroughSP", (req, res) => {
    insertUserThroughSP(req, res);
});

router.put("/updateUserThroughSP", (req, res) => {
    updateUserThroughSP(req, res);
});


module.exports = router;