import mysql.connector
from dotenv import load_dotenv
import os

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
    HAVING COUNT(c.car_ID) > 1;""", "Users who own more than one car"]
]

user_ID_queries = [
    ["""SELECT DISTINCT s.station_ID, s.name, s.city, s.state
    FROM Stations s
    JOIN TripStops ts ON s.station_ID = ts.station_ID
    JOIN Trip t ON t.trip_ID = ts.trip_ID
    WHERE t.user_ID = """ "%s"";", "Stations used by a specific user"]
]

def execute_query(query, title):
    cursor.execute(query)
    print(f"\n--- {title} ---\n")
    for result in cursor.fetchall():
        print(result)

def execute_query_with_user_ID_param(query, user_ID, title):
    cursor.execute(query, user_ID)
    print(f"\n--- {title} ---\n")
    for result in cursor.fetchall():
        print(result)

if __name__ == "__main__":
    for row in queries:
        execute_query(row[0], row[1])

    morequeries = input("\nDo you want to run queries with parameters? (y/n): ")

    if morequeries.lower() == 'y':
        user_ID = input("\nEnter user ID: ")
        execute_query_with_user_ID_param(user_ID_queries[0][0] % user_ID, (), user_ID_queries[0][1])