SELECT *
FROM Car
WHERE range_km > (SELECT AVG(range_km) FROM Car);