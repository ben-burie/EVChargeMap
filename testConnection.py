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

def test_connection():
    """Test MySQL database connection"""
    if connection.is_connected():
        db_info = connection.get_server_info()
        print(f"✓ Successfully connected to MySQL Server version {db_info}")
        
        # Get cursor and run a test query
        cursor = connection.cursor()
        cursor.execute("SELECT DATABASE();")
        record = cursor.fetchone()
        print(f"✓ Connected to database: {record[0]}")
        
        # Show tables in the database
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print(f"\n✓ Tables in database ({len(tables)} found):")
        for table in tables:
            print(f"  - {table[0]}")
        
        cursor.close()      

if __name__ == "__main__":
    test_connection()