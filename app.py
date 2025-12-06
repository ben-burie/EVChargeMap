from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Import helper scripts
import tripStopManager
import carManager
import tripManager
import userManager

app = Flask(__name__, static_folder='user-interface', static_url_path='')
CORS(app)

# Serve static files (HTML, CSS, JS)
@app.route('/')
def serve_index():
    return send_from_directory('user-interface', 'logon.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('user-interface', filename)

@app.route('/api/calculate-stations', methods=['POST'])
def calculate_stops():
    try:
        data = request.json
        
        start_lat = float(data.get('start_lat'))
        start_lng = float(data.get('start_lng'))
        end_lat = float(data.get('end_lat'))
        end_lng = float(data.get('end_lng'))
        
        stops = tripStopManager.calculate_intermediate_points(
            start_lat, start_lng, end_lat, end_lng
        )
        
        return jsonify({
            'success': True,
            'stops': stops,
            'total_stops': len(stops)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
      
@app.route('/api/get-cars', methods=['POST'])
def get_cars():
    try:
        cars = carManager.load_cars()
        return jsonify({
            'success': True,
            'cars': cars
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
@app.route('/api/get-user-cars', methods=['POST'])
def get_user_cars():
    data = request.json
    user_id = data.get('userId')
    try:
        cars = carManager.load_user_cars(user_id)
        return jsonify({
            'success': True,
            'cars': cars
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
@app.route('/api/add-car', methods=['POST'])
def add_car():
    try:
        data = request.json
        car_id = data.get('carId')
        user_id = data.get('userId')

        print(car_id, user_id)

        carManager.save_car(car_id, user_id)
        
        return jsonify({
            'success': True,
            'message': 'Car added successfully',
            'car': {
                'name': car_id
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
@app.route('/api/create-trip', methods=['POST'])
def create_trip():
    try:
        data = request.json
        stops = data.get('stops')
        car = data.get('car')

        tripManager.saveTrip(data)
        
        return jsonify({
            'success': True,
            'message': 'Trip created successfully',
            'trip': {
                'stops': stops,
                'car': car
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
@app.route('/api/get-trips', methods=['POST'])
def get_trips():
    try: 
        data = request.json
        userID = data.get('userID')
        trips = tripManager.load_user_trips(userID)

        formatted_trips = []
        for trip in trips:
            formatted_trips.append({
                'id': trip.get('trip_ID'),
                'name': trip.get('name'),
                'startLocation': trip.get('startLocation'),
                'endLocation': trip.get('endLocation')
            })

        return jsonify({
            'success': True,
            'trips': trips
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
@app.route('/api/get-trip-details', methods=['POST'])
def get_trip_details():
    try:
        data = request.json
        trip_id = data.get('tripId')
        
        trip_info = tripManager.load_trip_stops(trip_id)
        
        return jsonify({
            'success': True,
            'trip': trip_info
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        success, user = userManager.authenticate_user(username, password) #use user for other functions (as the current user)

        if success:
            return jsonify({
                'success': True,
                'user': user
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid username or password'
            }), 401
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        
        result = userManager.register_user(username, password, email)
        
        if result:
            return jsonify({
                'success': True,
                'message': 'User registered successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Registration failed'
            }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    tripStopManager.load_stations()
    app.run(debug=True, port=5000)