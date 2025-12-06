CREATE DEFINER=`root`@`localhost` PROCEDURE `LoadAllUSStations`()
BEGIN
	SELECT station_ID,
    name,
    city,
    state,
    latitude,
    longitude
    FROM stations
    WHERE country_code='US';
END