CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTripStops`(
	IN trip_ID_in BIGINT
)
BEGIN
	SELECT 
		ts.station_ID,
        ts.stop_seq,
        s.name AS station_name,
        s.city AS station_city,
        s.state AS station_state,
        c.brand AS car_brand,
        c.model AS car_model
    FROM tripstops ts
    INNER JOIN Trip t ON ts.trip_ID = t.trip_ID
    INNER JOIN Stations s ON ts.station_ID = s.station_ID
    INNER JOIN car c ON c.car_ID=t.car_ID
    WHERE t.trip_ID = trip_ID_in
    ORDER BY ts.stop_seq;
END