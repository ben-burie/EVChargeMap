CREATE DEFINER=`root`@`localhost` PROCEDURE `LoadUserCars`(
	IN user_ID_in BIGINT
)
BEGIN
	SELECT *
    FROM car AS c 
    JOIN own AS o ON c.car_ID = o.car_ID
	WHERE o.user_ID = user_ID_in;
END