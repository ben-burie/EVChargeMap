CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateAccount`(
	IN name_in VARCHAR(50),
    IN email_in VARCHAR(100),
    IN password_in VARCHAR(255)
)
BEGIN
    INSERT INTO User (name, email, password)
    VALUES (name_in, email_in, password_in);
END