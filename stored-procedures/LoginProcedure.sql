CREATE DEFINER=`root`@`localhost` PROCEDURE `LoginProcedure`(
    IN name_in VARCHAR(50),
    IN password_in VARCHAR(255)
)
BEGIN
    SELECT *
    FROM user
    WHERE name = name_in
    AND password = password_in;
END