    document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await loadProfile();
    
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleUpdateProfile);
    }
});

async function loadProfile() {
    try {
        const result = await getProfile();
        
        if (result.success && result.user) {
            document.getElementById('name').value = result.user.name;
            document.getElementById('email').value = result.user.email;
        }
    } catch (error) {
        showAlert('Erro ao carregar perfil: ' + error.message, 'danger');
    }
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    
    const updateData = {};
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    
    if (name !== '') updateData.name = name;
    if (email !== '') updateData.email = email;
    if (newPassword !== '') updateData.password = newPassword;
    
    const updateBtn = document.getElementById('updateBtn');
    updateBtn.disabled = true;
    updateBtn.textContent = 'Atualizando...';
    
    try {
        const result = await updateProfile(updateData);
        
        if (result.success) {
            showAlert('Perfil atualizado com sucesso!', 'success');
            setUser(result.user);
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        }
    } catch (error) {
        showAlert('Erro ao atualizar perfil: ' + error.message, 'danger');
        updateBtn.disabled = false;
        updateBtn.textContent = 'Atualizar Perfil';
    }
}