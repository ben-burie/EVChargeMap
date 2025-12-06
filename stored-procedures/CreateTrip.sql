CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateTrip`(
	IN user_ID_in BIGINT,
    IN car_ID_in BIGINT,
    IN trip_name_in VARCHAR(150),
    IN start_location_in VARCHAR(150),
    IN end_location_in VARCHAR(150),
    OUT trip_ID_out BIGINT
)
BEGIN
	INSERT INTO trip(user_ID, car_ID, trip_name, start_location, end_location)
    VALUES (user_ID_in, car_ID_in, trip_name_in, start_location_in, end_location_in);
    
    SET trip_id_out = LAST_INSERT_ID();
END