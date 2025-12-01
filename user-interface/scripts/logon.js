document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('loginTab');
    const createTab = document.getElementById('createTab');
    const loginForm = document.getElementById('loginForm');
    const createForm = document.getElementById('createForm');
    const submitBtn = document.querySelector('.submit-btn');

    const API_BASE_URL = 'http://localhost:5000/api';

    if (!loginTab || !createTab || !loginForm || !createForm || !submitBtn) {
        console.error('Logon page: missing one or more DOM elements.');
        return;
    }

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        createTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        createForm.classList.add('hidden');
    });

    createTab.addEventListener('click', () => {
        createTab.classList.add('active');
        loginTab.classList.remove('active');
        createForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    submitBtn.addEventListener('click', async () => {
        if (loginTab.classList.contains('active')) {
            await handleLogin();
        } else {
            await handleCreateAccount();
        }
    });

    async function handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            console.log(data.success);

            if (data.success) {
                console.log('Login successful:', data.user);
                alert(`Welcome back, ${username}!`);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/trips.html';
            } else {
                alert(`Login failed: ${data.error}`);
                console.error('Login error:', data.error);
            }
        } catch (error) {
            console.error('Network error during login:', error);
            alert('Error connecting to server. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    }

    async function handleCreateAccount() {
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        // Validation
        if (!username || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('Account created successfully');
                alert('Account created successfully! Please log in with your credentials.');

                document.getElementById('newUsername').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                
                loginTab.click();
            } else {
                alert(`Registration failed: ${data.error}`);
                console.error('Registration error:', data.error);
            }
        } catch (error) {
            console.error('Network error during registration:', error);
            alert('Error connecting to server. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    }
});