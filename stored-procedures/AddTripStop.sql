CREATE DEFINER=`root`@`localhost` PROCEDURE `AddTripStop`(
	IN trip_ID_in BIGINT,
    IN stop_seq_in BIGINT,
    IN station_ID_in BIGINT
)
BEGIN
	INSERT INTO tripstops(trip_ID, stop_seq, station_ID)
    VALUES (trip_ID_in, stop_seq_in, station_ID_in);
END