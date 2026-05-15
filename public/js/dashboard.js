document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await loadDashboard();
    
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteAccount);
    }
});

async function loadDashboard() {
    try {
        const result = await getProfile();
        
        if (result.success && result.user) {
            const user = result.user;
            
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userRole').textContent = user.role || 'user';
            document.getElementById('userId').textContent = user._id;
            
            if (user.createdAt) {
                const date = new Date(user.createdAt);
                document.getElementById('userCreatedAt').textContent = date.toLocaleDateString('pt-BR');
            }
            
            if (user.lastLogin) {
                const date = new Date(user.lastLogin);
                document.getElementById('userLastLogin').textContent = date.toLocaleDateString('pt-BR');
            }
            
            setUser(user);
        }
    } catch (error) {
        showAlert('Erro ao carregar dashboard: ' + error.message, 'danger');
    }
}

async function handleDeleteAccount() {
    const confirmed = confirm('Tem certeza que deseja deletar sua conta? Esta acao e irreversivel.');
    
    if (!confirmed) return;
    
    try {
        await deleteAccount();
        showAlert('Conta deletada com sucesso!', 'success');
        logout();
    } catch (error) {
        showAlert('Erro ao deletar conta: ' + error.message, 'danger');
    }
}