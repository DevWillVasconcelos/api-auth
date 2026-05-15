document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showAlert('As senhas nao coincidem', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showAlert('A senha deve ter no minimo 6 caracteres', 'danger');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';
    
    try {
        const result = await registerUser({ name, email, password });
        
        if (result.success && result.token) {
            setToken(result.token);
            setUser(result.user);
            showAlert('Registro realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        }
    } catch (error) {
        showAlert(error.message, 'danger');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrar';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrando...';
    
    try {
        const result = await loginUser({ email, password });
        
        if (result.success && result.token) {
            setToken(result.token);
            setUser(result.user);
            showAlert('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        }
    } catch (error) {
        showAlert(error.message, 'danger');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
    }
}

if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}