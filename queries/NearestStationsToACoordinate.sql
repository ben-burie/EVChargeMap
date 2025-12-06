SELECT
       s.station_ID,
       s.name,
       s.city,
       s.state,
       6371.0 * 2.0 * ASIN(
         SQRT(
           POWER(SIN(RADIANS((s.latitude  - 41) / 2.0)), 2) +
           COS(RADIANS(41)) * COS(RADIANS(s.latitude)) *
           POWER(SIN(RADIANS((s.longitude - (-87)) / 2.0)), 2)
         )
       ) AS distance_km
FROM Stations s
ORDER BY distance_km ASC, s.name
LIMIT 20;