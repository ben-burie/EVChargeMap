import mysql.connector
from dotenv import load_dotenv
import os
import time

load_dotenv()

connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

cursor = connection.cursor()

queries = [
   ["SELECT * FROM user;", "Select all users"],

   ["""SELECT u.user_ID, AVG(stop_counts.num_stops) AS avg_stops_per_trip 
   FROM User u 
   JOIN Trip t ON u.user_ID = t.user_ID JOIN (
   SELECT trip_ID, COUNT(*) AS num_stops
        FROM TripStops
        GROUP BY trip_ID
    ) AS stop_counts
        ON t.trip_ID = stop_counts.trip_ID
    GROUP BY u.user_ID, u.user_id
    ORDER BY avg_stops_per_trip DESC;""", "Average number of stops per trip for each user"],

    ["""    SELECT 
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
    LIMIT 20;""", "Top 20 most frequently used stations in trips"],

    ["""SELECT t.trip_ID, t.trip_name, COUNT(ts.stop_seq) AS stops
    FROM trip t
    JOIN tripstops ts ON t.trip_ID = ts.trip_ID
    GROUP BY t.trip_ID, t.trip_name
    ORDER BY stops DESC
    LIMIT 1;""", "Get the trip with the highest number of stops"],

    ["""SELECT u.user_ID, u.name, COUNT(c.car_ID) AS num_cars
    FROM User u
    JOIN own o ON o.user_ID = u.user_ID
    JOIN car c ON c.car_ID=o.car_ID
    GROUP BY u.user_ID, u.name
    HAVING COUNT(c.car_ID) > 1;""", "Users who own more than one car"],

    ["""SELECT t.trip_ID, t.trip_name, COUNT(ts.stop_seq) AS stops
    FROM Trip t
    JOIN TripStops ts ON t.trip_ID = ts.trip_ID
    GROUP BY t.trip_ID, t.trip_name
    ORDER BY stops DESC LIMIT 1;""", "Longest trip"],

    ["""SELECT *
    FROM Car
    WHERE range_km > (SELECT AVG(range_km) FROM Car);""", "Cars with above average mileage"],

    ["""    SELECT 
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
    ORDER BY avg_stops_per_trip DESC;""", "Average trip length per user"]
]

user_ID_queries = [
    ["""SELECT DISTINCT s.station_ID, s.name, s.city, s.state
    FROM Stations s
    JOIN TripStops ts ON s.station_ID = ts.station_ID
    JOIN Trip t ON t.trip_ID = ts.trip_ID
    WHERE t.user_ID = %s;""", "Stations used by a specific user"],

    ["""SELECT t.trip_ID,
       t.trip_name,
       COUNT(ts.stop_seq) AS stop_count
    FROM Trip t
    LEFT JOIN TripStops ts
    ON ts.trip_ID = t.trip_ID
    WHERE t.user_ID =  %s
    GROUP BY t.trip_ID, t.trip_name
    ORDER BY stop_count DESC, t.trip_ID;""", "Trips for a user with number of stops"],

    ["""SELECT s.station_ID, s.name, s.city, s.state
    FROM Stations s
    WHERE s.state = %s
    AND NOT EXISTS (
            SELECT 1
            FROM TripStops ts
            JOIN Trip t
            ON t.trip_ID = ts.trip_ID
            WHERE ts.station_ID = s.station_ID
            AND t.user_ID = %s
        )
    ORDER BY s.name;
    """, "Stations not yet visited by a user in a given state"],

    ["""SELECT
       s.station_ID,
       s.name,
       s.city,
       s.state,
       6371.0 * 2.0 * ASIN(
         SQRT(
           POWER(SIN(RADIANS((s.latitude  - %s) / 2.0)), 2) +
           COS(RADIANS(%s)) * COS(RADIANS(s.latitude)) *
           POWER(SIN(RADIANS((s.longitude - (%s)) / 2.0)), 2)
         )
       ) AS distance_km
    FROM Stations s
    ORDER BY distance_km ASC, s.name
    LIMIT %s;""", "Nearest stations to a coordinate"],

    ["""SELECT 
    t.trip_id,
    t.start_location,
    t.end_location,
    COUNT(ts.station_id) AS num_charging_stops
    FROM trip t
    LEFT JOIN TripStops ts ON ts.trip_id = t.trip_id
    WHERE t.user_id = %s
    GROUP BY t.trip_id;
    """, "Show trip history with charging summary"]
]

big_queries = [
    ["""SELECT car_Id, brand, model, battery_capacity_kWh, battery_type, range_km
    FROM Car;""", "Get all cars"],

    ["""SELECT station_id, name, latitude, longitude, city, state
    FROM Stations
    WHERE country_code='US';""", "Get all stations in the US"]
]

def execute_query(query, title):
    start_time = time.time()
    cursor.execute(query)
    results = cursor.fetchall()
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"\n--- {title} ---\n")
    for result in results:
        print(result)

    print("\nElapsed time: " + str(round(elapsed_time, 5)) + " seconds")

def execute_query_with_user_ID_param(query, user_ID, title):
    start_time = time.time()
    cursor.execute(query, (user_ID,))
    results = cursor.fetchall()
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"\n--- {title} ---\n")
    for result in results:
        print(result)

    print("\nElapsed time: " + str(round(elapsed_time, 5)) + " seconds")

def execute_query_with_multiple_params(query, params, title):
    start_time = time.time()
    cursor.execute(query, params)
    results = cursor.fetchall()
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"\n--- {title} ---\n")
    for result in results:
        print(result)
    
    print("\nElapsed time: " + str(round(elapsed_time, 5)) + " seconds")

def execute_big_queries(query, title):
    start_time = time.time()
    cursor.execute(query)
    results = cursor.fetchall()
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"\n--- {title} ---\n")
    for result in results:
        print(result)
    
    print("\nElapsed time: " + str(round(elapsed_time, 5)) + " seconds")

if __name__ == "__main__":
    print("----- Select which query to execute ----------")
    print("1. Get all US stations")
    print("2. Get all cars")
    print("3. Get all stations visited by a specific user")
    print("4. Get the longest trip")
    print("5. Find users with more than one car")
    print("6. Find cars with an above average mileage range")
    print("7. Trips for a user with number of stops")
    print("8. Most popular stations (by distinct trips that used them)")
    print("9. Average trip length per user")
    print("10. Stations not yet visited by a user in a given state")
    print("11. Nearest stations to a coordinate")
    print("12. Show trip history with charging summary")
    print("13. Exit")

    choice = int(input("\nSelect an option from menu above: "))
    while (choice != 13):
        match choice:
            case 1:
                execute_big_queries(big_queries[1][0], big_queries[1][1])
            case 2:
                execute_big_queries(big_queries[0][0], big_queries[0][1])
            case 3:
                user_ID = input("\nEnter user ID: ")
                execute_query_with_user_ID_param(user_ID_queries[0][0], user_ID, user_ID_queries[0][1])
            case 4:
                execute_query(queries[5][0], queries[5][1])
            case 5:
                execute_query(queries[4][0], queries[4][1])
            case 6:
                execute_query(queries[6][0], queries[6][1])
            case 7:
                user_ID = input("\nEnter user ID: ")
                execute_query_with_user_ID_param(user_ID_queries[1][0], user_ID, user_ID_queries[1][1])
            case 8:
                execute_query(queries[2][0], queries[2][1])
            case 9:
                execute_query(queries[7][0], queries[7][1])
            case 10:
                state = input("\nEnter state abbreviation (e.g 'WI'): ")
                user_ID = input("\nEnter user ID: ")
                execute_query_with_multiple_params(user_ID_queries[2][0], (state, user_ID), user_ID_queries[2][1])
            case 11:
                lat = float(input("\nEnter latitude: "))
                lon = float(input("\nEnter longitude: "))
                limit = int(input("\nHow many nearest stations to select: "))
                execute_query_with_multiple_params(user_ID_queries[3][0], (lat, lat, lon, limit), user_ID_queries[3][1])
            case 12:
                user_ID = input("\nEnter user ID: ")
                execute_query_with_user_ID_param(user_ID_queries[4][0], user_ID, user_ID_queries[4][1])

        print("\n----- Select which query to execute ----------")
        print("1. Get all US stations")
        print("2. Get all cars")
        print("3. Get all stations visited by a specific user")
        print("4. Get the longest trip")
        print("5. Find users with more than one car")
        print("6. Find cars with an above average mileage range")
        print("7. Trips for a user with number of stops")
        print("8. Most popular stations (by distinct trips that used them)")
        print("9. Average trip length per user")
        print("10. Stations not yet visited by a user in a given state")
        print("11. Nearest stations to a coordinate")
        print("12. Show trip history with charging summary")
        print("13. Exit")

        choice = int(input("\nSelect an option from menu above: "))
        while (choice < 1 or choice > 13):
            choice = int(input("Invalid choice...please select again: "))