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

def authenticate_user(username, password):\

    cursor.callproc('LoginProcedure', [username, password])

    for result in cursor.stored_results():
        rows = result.fetchall()
        for row in rows:
            if (row[1] != "" and row[3] != ""):
                username = row[1]
                return True, username
    
    return False, None

def register_user(username, password, email):
    cursor.callproc('CreateAccount', [username, email, password])
    connection.commit()
    return True