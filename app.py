from flask import Flask, request, jsonify
from flask_cors import CORS

# Import helper scripts
import tripStopManager
import carManager
import tripManager
import userManager

app = Flask(__name__)
CORS(app)

@app.route('/api/calculate-stations', methods=['POST'])
def calculate_stops():
    try:
        data = request.json
        
        start_lat = float(data.get('start_lat'))
        start_lng = float(data.get('start_lng'))
        end_lat = float(data.get('end_lat'))
        end_lng = float(data.get('end_lng'))
        
        # Calculate intermediate points
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
    """Return list of available car models"""
    try:
        cars = tripStopManager.load_cars()
        return jsonify({
            'success': True,
            'cars': cars
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
@app.route('/api/create-trip', methods=['POST'])
def create_trip():
    """Receive trip data and store it (mock implementation)"""
    try:
        data = request.json
        stops = data.get('stops')
        car = data.get('car')

        tripStopManager.saveTrip(data)
        
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

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    tripStopManager.load_stations('us_stations_test.csv')
    app.run(debug=True, port=5000)