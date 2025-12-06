SELECT t.trip_ID,
       t.trip_name,
       COUNT(ts.stop_seq) AS stop_count
FROM Trip t
LEFT JOIN TripStops ts
  ON ts.trip_ID = t.trip_ID
WHERE t.user_ID = 1  -- Replace with actual user_ID value
GROUP BY t.trip_ID, t.trip_name
ORDER BY stop_count DESC, t.trip_ID;