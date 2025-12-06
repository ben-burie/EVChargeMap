SELECT u.user_ID, u.name, COUNT(c.car_ID) AS num_cars
    FROM User u
    JOIN own o ON o.user_ID = u.user_ID
    JOIN car c ON c.car_ID=o.car_ID
    GROUP BY u.user_ID, u.name
    HAVING COUNT(c.car_ID) > 1;