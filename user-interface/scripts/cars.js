// Get DOM elements
const myTripsBtn = document.getElementById('myTripsBtn');
const addBtn = document.getElementById('addBtn');
const carSearch = document.getElementById('addCarDropdown');
const carsTable = document.getElementById('carsTable');
const carsTableBody = document.getElementById('carsTableBody');

const user = JSON.parse(sessionStorage.getItem('user'));

if (!user) {
    alert('You must be logged in');
    window.location.href = '/logon.html';
}

const API_BASE_URL = 'http://localhost:5000/api';
let cars = [];
let user_cars = [];

async function loadCarsFromBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/get-cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (data.success) {
            cars = data.cars;
            console.log('Cars loaded from backend:', cars);
            //renderCarsTable();
            populateCarSearch();
        } else {
            console.error('Failed to load cars:', data.error);
            alert('Error loading cars: ' + data.error);
        }
    } catch (error) {
        console.error('Network error while loading cars:', error);
        alert('Error connecting to server. Please try again.');
    }
}

async function loadUserCars() {
    try {
        const response = await fetch(`${API_BASE_URL}/get-user-cars`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user
            })
        });

        const data = await response.json();

        if (data.success) {
            user_cars = data.cars;
            renderCarsTable();
        } else {
            console.error('Failed to load cars:', data.error);
            alert('Error loading cars: ' + data.error);
        }
    } catch (error) {
        console.error('Network error while loading cars:', error);
        alert('Error connecting to server. Please try again.');
    }
}

function renderCarsTable() {
    carsTableBody.innerHTML = '';
    
    if (user_cars.length === 0) {
        return;
    }
    
    user_cars.forEach((car, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${car.name || car.carName || 'Unknown Car'}</td>
        `;
        
        row.addEventListener('click', function() {
            const carName = row.cells[1].textContent;
            console.log('Clicked on:', carName);
        });
        
        carsTableBody.appendChild(row);
    });
}

function populateCarSearch() {
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.id || car.carId || '';
        option.textContent = car.name || car.carName || 'Unknown Car';
        carSearch.appendChild(option);
    });
}

myTripsBtn.addEventListener('click', function() {
    console.log('Navigate to My Trips page');
    window.location.href = 'trips.html';
});

const modal = document.getElementById('addCarModal');
const addCarDropdown = document.getElementById('addCarDropdown');

document.addEventListener('DOMContentLoaded', function() {
    const closeModalBtn = document.getElementById('closeModalBtn');
    const confirmAddBtn = document.getElementById('confirmAddBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeAddCarModal();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeAddCarModal();
        });
    }

    if (confirmAddBtn) {
        confirmAddBtn.addEventListener('click', async function() {
            await handleAddCar();
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeAddCarModal();
        }
    });
});

addBtn.addEventListener('click', function() {
    console.log('Opening add car modal');
    openAddCarModal();
});

async function handleAddCar() {
    const selectedCarId = addCarDropdown.value;
    console.log('Selected car ID:', selectedCarId);
    console.log('Available cars:', cars);
    console.log('Dropdown HTML:', addCarDropdown.innerHTML);
    
    if (selectedCarId === '' || selectedCarId === undefined) {
        alert('Please select a car');
        return;
    }
    
    const selectedCar = parseInt(selectedCarId) + 1;
    
    if (!selectedCar) {
        console.error('Selected car not found. Available cars:', cars);
        alert('Car not found');
        return;
    }
    
    console.log('Adding car to user account:', selectedCar);
    
    try {
        const response = await fetch(`${API_BASE_URL}/add-car`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                carId: selectedCar,
                userId: user
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Car added successfully');
            alert('Car added successfully!');
            closeAddCarModal();
            loadCarsFromBackend();
            renderCarsTable();
        } else {
            alert('Error adding car: ' + data.error);
            console.error('Failed to add car:', data.error);
        }
    } catch (error) {
        console.error('Network error while adding car:', error);
        alert('Error connecting to server. Please try again.');
    }
}

function openAddCarModal() {
    modal.style.display = 'block';
    populateAddCarDropdown();
}

function closeAddCarModal() {
    modal.style.display = 'none';
    addCarDropdown.value = '';
}

function populateAddCarDropdown() {
    addCarDropdown.innerHTML = '<option value="">Select a car</option>';
    
    console.log('Populating dropdown with cars:', cars);
    
    cars.forEach((car, index) => {
        const option = document.createElement('option');
        const carId = car.id || car.carId || index;
        option.value = carId;
        option.textContent = car.name || car.carName || 'Unknown Car';
        console.log(`Adding option: value=${carId}, text=${option.textContent}`);
        addCarDropdown.appendChild(option);
    });
}

carSearch.addEventListener('change', function() {
    const selectedCarId = carSearch.value;
    console.log('Selected car ID:', selectedCarId);
    
    if (selectedCarId === '') {
        renderCarsTable();
    } else {
        const filteredCars = cars.filter(car => (car.id || car.carId) == selectedCarId);
        carsTableBody.innerHTML = '';
        
        filteredCars.forEach((car, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${car.name || car.carName || 'Unknown Car'}</td>
            `;
            
            row.addEventListener('click', function() {
                const carName = row.cells[1].textContent;
                console.log('Clicked on:', carName);
            });
            
            carsTableBody.appendChild(row);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, loading cars from backend');
    loadCarsFromBackend();
    loadUserCars();

    setTimeout(() => {
        console.log('Dropdown options:', addCarDropdown.innerHTML);
        console.log('Cars array:', cars);
    }, 1000);
});