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

def load_cars():
    cars = []

    cursor.callproc('LoadAllCars')
    for result in cursor.stored_results():
        rows = result.fetchall()
        for row in rows:
            car = row[0] + " " + row[1]
            cars.append({'name': car})

    return cars

def save_car(car_id, user_id):
    cursor.callproc('AddCar', [user_id, car_id])
    connection.commit()
    return True

def load_user_cars(user_id):
    cars = []

    cursor.callproc('LoadUserCars', [user_id])
    for result in cursor.stored_results():
        rows = result.fetchall()
        for row in rows:
            car = row[0] + " " + row[1]
            cars.append({'name': car, 'range': row[4]})

    return cars