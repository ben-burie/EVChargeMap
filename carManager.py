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

def load_cars(): # Change the stored procedure later so that it only pulls cars that the user owns
    cars = []

    cursor.callproc('LoadAllCars')
    for result in cursor.stored_results():
        rows = result.fetchall()
        for row in rows:
            car = row[0] + " " + row[1]
            cars.append({'name': car})

    return cars

#def save_car(car_name): # Save car to the database