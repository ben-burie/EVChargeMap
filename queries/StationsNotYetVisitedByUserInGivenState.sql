SELECT s.station_ID, s.name, s.city, s.state
FROM Stations s
WHERE s.state = 'WI'
  AND NOT EXISTS (
        SELECT 1
        FROM TripStops ts
        JOIN Trip t
          ON t.trip_ID = ts.trip_ID
        WHERE ts.station_ID = s.station_ID
          AND t.user_ID = 1
      )
ORDER BY s.name;
