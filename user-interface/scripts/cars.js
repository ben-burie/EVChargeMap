// Get DOM elements
const myTripsBtn = document.getElementById('myTripsBtn');
const addBtn = document.getElementById('addBtn');
const carSearch = document.getElementById('carSearch');
const carsTable = document.getElementById('carsTable');

// My Trips button click handler
myTripsBtn.addEventListener('click', function() {
    console.log('Navigate to My Trips page');
    // Add navigation logic here
    // window.location.href = 'trips.html';
});

// Add button click handler
addBtn.addEventListener('click', function() {
    console.log('Add new car');
    // Add logic to add a new car to the table
});

// Car search dropdown change handler
carSearch.addEventListener('change', function() {
    const selectedCar = carSearch.value;
    console.log('Selected car:', selectedCar);
    // Add logic to filter or highlight the selected car
});

// Table row click handler
const tableRows = carsTable.querySelectorAll('tbody tr');
tableRows.forEach(function(row) {
    row.addEventListener('click', function() {
        const carName = row.cells[1].textContent;
        console.log('Clicked on:', carName);
        // Add logic to view/edit car details
    });
});