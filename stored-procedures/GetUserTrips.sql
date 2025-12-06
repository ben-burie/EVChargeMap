CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserTrips`(
	IN user_ID_in BIGINT
)
BEGIN
	SELECT * 
    FROM trip 
    WHERE user_id = user_ID_in;
END