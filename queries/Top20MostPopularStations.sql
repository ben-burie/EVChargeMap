SELECT 
	s.station_ID,
	s.name,
	s.city,
	s.state,
	COUNT(DISTINCT ts.trip_ID) AS trips_using_station
FROM Stations s
JOIN TripStops ts
	ON ts.station_ID = s.station_ID
GROUP BY s.station_ID, s.name, s.city, s.state
ORDER BY trips_using_station DESC, s.name
LIMIT 20;