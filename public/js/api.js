async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (requiresAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    const options = {
        method: method,
        headers: headers
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(endpoint, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erro na requisicao');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function registerUser(userData) {
    return await apiRequest(config.endpoints.register, 'POST', userData, false);
}

async function loginUser(credentials) {
    return await apiRequest(config.endpoints.login, 'POST', credentials, false);
}

async function getProfile() {
    return await apiRequest(config.endpoints.me, 'GET');
}

async function updateProfile(userData) {
    return await apiRequest(config.endpoints.me, 'PUT', userData);
}

async function deleteAccount() {
    return await apiRequest(config.endpoints.me, 'DELETE');
}