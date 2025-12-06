SELECT DISTINCT s.station_ID, s.name, s.city, s.state
FROM Stations s
JOIN TripStops ts ON s.station_ID = ts.station_ID
JOIN Trip t ON t.trip_ID = ts.trip_ID
WHERE t.user_ID = 1;
