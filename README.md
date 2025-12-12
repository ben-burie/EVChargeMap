# EV Trip Planner

A simple full-stack web app that helps electric vehicle drivers plan road trips.  
Pick an EV, enter start and end locations, and view charging stations along the route. Save trips, vehicles, and accounts.

---

## 🚗 Features

- Create an account and log in. 
- Add and save vehicles you own.  
- Plan a trip by entering start and end locations.  
- View charging stations along the route on a map.  
- Add charging stops to a trip and save the trip.  
- Suggested number of stops provided based on vehicle range.

---

## 🖼️ Screenshots

### **Login Page**  
![Login Page](images/login.png)

### **Trip Manager**  
![Trip Manager](images/trip_planner.png)

### **Station Map / Stops**  
![Station Map](images/station_map.png)

---

## 🛠️ Tech Stack

**Frontend**  
- HTML, CSS, JavaScript

**Backend**  
- Python (Flask)

**Database**  
- MySQL

**Other**  
- REST API routes for users, cars, trips, and station lookups  
- Stored procedures and optimized SQL queries for geospatial lookups

---

## 📦 Data Sources

- Global EV Charging Stations Dataset: https://www.kaggle.com/datasets/tarekmasryo/global-ev-charging-stations/data?select=charging_station.csv
- Electric Vehicle Specifications Dataset: https://www.kaggle.com/datasets/urvishahir/electric-vehicle-specifications-dataset-2025
