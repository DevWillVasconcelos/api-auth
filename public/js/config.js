const API_URL = 'http://localhost:3000/api/v1';

const config = {
    apiUrl: API_URL,
    endpoints: {
        register: `${API_URL}/register`,
        login: `${API_URL}/login`,
        me: `${API_URL}/me`,
        users: `${API_URL}/users`
    }
};

function showAlert(message, type = 'danger') {
    const alertDiv = document.getElementById('alertMessage');
    if (alertDiv) {
        alertDiv.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

function isAuthenticated() {
    return !!getToken();
}

function checkAuth() {
    if (!isAuthenticated() && !window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
        window.location.href = '/login.html';
    }
}