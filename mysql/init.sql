use Test;
CREATE TABLE IF NOT EXISTS users (
    id INT,
    full_name VARCHAR(150)
);

-- *** Store Procedure for GET all the Users ***
DROP procedure IF EXISTS sp_getAllUsers;

DELIMITER $$

CREATE PROCEDURE sp_getAllUsers ()
BEGIN
	select * from users;
END$$

DELIMITER ;


-- *** Store Procedure for INSERT User ***
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


-- *** Store Procedure for UPDATE User ***
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


-- *** Store Procedure for GET User by ID ***
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

