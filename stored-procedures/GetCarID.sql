CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCarID`(
	IN car_brand VARCHAR(150),
    IN car_model VARCHAR(150)
)
BEGIN
	SELECT car_ID
    FROM car
    WHERE brand=car_brand AND model=car_model;
END