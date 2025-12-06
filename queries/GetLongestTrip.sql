SELECT t.trip_ID, t.trip_name, COUNT(ts.stop_seq) AS stops
FROM Trip t
JOIN TripStops ts ON t.trip_ID = ts.trip_ID
GROUP BY t.trip_ID, t.trip_name
ORDER BY stops DESC LIMIT 1;