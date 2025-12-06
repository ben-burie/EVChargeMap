SELECT 
    t.trip_id,
    t.start_location,
    t.end_location,
    COUNT(ts.station_id) AS num_charging_stops
FROM trip t
LEFT JOIN TripStops ts ON ts.trip_id = t.trip_id
WHERE t.user_id = 1
GROUP BY t.trip_id;
