-------------------------------------------
*** Store Procedure for GET all the Users ***
-------------------------------------------
DROP procedure IF EXISTS sp_getAllUsers ;

DELIMITER $$

CREATE PROCEDURE sp_getAllUsers ()
BEGIN
	select * from users;
END$$

DELIMITER ;


-------------------------------------------
*** Store Procedure for INSERT User ***
-------------------------------------------
DROP PROCEDURE IF EXISTS sp_insertUser;

DELIMITER $$

CREATE PROCEDURE sp_insertUser (
  in $id int,
  in $full_name varchar(150)
)
BEGIN
  insert into users(id, full_name) values ($id, $full_name);
  select * from users where id = $id;
END$$

DELIMITER ;


-------------------------------------------
*** Store Procedure for UPDATE User ***
-------------------------------------------
DROP PROCEDURE IF EXISTS sp_updateUser;

DELIMITER $$

CREATE PROCEDURE sp_updateUser (
  in $id int,
  in $full_name varchar(150)
)
BEGIN
  update users set full_name = $full_name where id = $id;
  select * from users where id = $id;
END$$

DELIMITER ;


-------------------------------------------
*** Store Procedure for GET User by ID ***
-------------------------------------------
DROP PROCEDURE IF EXISTS sp_updateUser;

DELIMITER $$

CREATE PROCEDURE sp_updateUser (
  in $id int,
  in $full_name varchar(150)
)
BEGIN
  update users set full_name = $full_name where id = $id;
  select * from users where id = $id;
END$$

DELIMITER ;


-------------------------------------------

************************************************
// async function createTable(req, res) {
//     try {
//         console.log('connected as id ' + connection.threadId);
//         connection.query(`
//         CREATE TABLE IF NOT EXISTS users (
//             id INT,
//             full_name VARCHAR(150)
//         )`, function (err, rows) {
//             connection.release();
//             if (err) {
//                 res.json(err);
//             }
//             res.json(rows)
//         });
//     } catch (error) {
//         console.log({
//             error
//         })
//         res.json({
//             error
//         })
//     }
// }

// async function getAllUsers(req, res) {
//     try {
//         console.log('connected as id ' + connection.threadId);
//         connection.query("select * from users", function (err, rows) {
//             connection.release();
//             if (err) {
//                 res.json(err);
//             }
//             res.json(rows)
//         });
//     } catch (error) {
//         console.log({
//             error
//         })
//     }
// }

// async function insertNewUser(req, res) {
//     try {
//         let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
//         let query = mysql.format(insertQuery, ["users", "id", "full_name", req.body.id, req.body.full_name]);
//         console.log('insertNewUser as id ' + connection.threadId);
//         connection.query(query, function (err, rows) {
//             // pool.query(query, (err, response) => {
//             if (err) {
//                 console.error(err);
//                 res.json({
//                     err
//                 })
//             }
//             // rows added
//             res.json({
//                 rows
//             })
//         });
//     } catch (error) {
//         console.log({
//             error
//         })
//     }
// }


// app.get("/createTable", (req, res) => {
//     createTable(req, res);
// })

// app.get("/getAllUsers", function (req, res) {
//     getAllUsers(req, res);
// });

// app.route("/insertNewUser").post(bodyParser.json(), function (req, res) {
//     insertNewUser(req, res);
// });