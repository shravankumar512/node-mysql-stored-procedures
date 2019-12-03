
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
  out userId int,
  in id int,
  in full_name varchar(150)
)
BEGIN
  insert into users(id, full_name) values (id, full_name);
  set userId = id;
END$$

DELIMITER ;


*** Store Procedure for UPDATE User ***
-------------------------------------------
DROP PROCEDURE IF EXISTS sp_updateUser;

DELIMITER $$

CREATE PROCEDURE sp_updateUser (
  out userId int,
  in id int,
  in full_name varchar(150)
)
BEGIN
  update users u set u.full_name = full_name where u.id = id;
  set userId = id;
END$$

DELIMITER ;
-------------------------------------------

