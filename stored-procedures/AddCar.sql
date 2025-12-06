CREATE DEFINER=`root`@`localhost` PROCEDURE `AddCar`(
	IN user_ID_in BIGINT,
    IN car_ID_in BIGINT
)
BEGIN
	INSERT INTO own (user_ID, car_ID)
    VALUES (user_ID_in, car_ID_in);
END