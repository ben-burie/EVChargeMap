SELECT 
	u.user_ID,
	u.user_id,
	AVG(stop_counts.num_stops) AS avg_stops_per_trip
FROM User u
JOIN Trip t ON u.user_ID = t.user_ID
JOIN (
	SELECT trip_ID, COUNT(*) AS num_stops
	FROM TripStops
	GROUP BY trip_ID
) AS stop_counts
	ON t.trip_ID = stop_counts.trip_ID
GROUP BY u.user_ID, u.user_id
ORDER BY avg_stops_per_trip DESC;