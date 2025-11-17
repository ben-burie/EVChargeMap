document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('loginTab');
    const createTab = document.getElementById('createTab');
    const loginForm = document.getElementById('loginForm');
    const createForm = document.getElementById('createForm');
    const submitBtn = document.querySelector('.submit-btn');

    if (!loginTab || !createTab || !loginForm || !createForm || !submitBtn) {
        console.error('Logon page: missing one or more DOM elements.');
        return;
    }

    // Switch to Login tab
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        createTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        createForm.classList.add('hidden');
    });

    // Switch to Create Account tab
    createTab.addEventListener('click', () => {
        createTab.classList.add('active');
        loginTab.classList.remove('active');
        createForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Submit button logic
    submitBtn.addEventListener('click', () => {
        if (loginTab.classList.contains('active')) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            console.log('Login submitted:', { username, password });
            alert(`Login attempt:\nUsername: ${username}`);
        } else {
            const username = document.getElementById('newUsername').value.trim();
            const password = document.getElementById('newPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            console.log('Create account submitted:', { username, password, confirmPassword });
            alert(`Account creation attempt:\nUsername: ${username}`);
        }
    });
});
