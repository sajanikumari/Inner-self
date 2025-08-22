document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = 'index.html';

    // Load user data
    const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
        const user = await res.json();
        document.getElementById('settings-name').value = user.name;
        document.getElementById('settings-email').value = user.email;
    }

    // Update profile
    document.getElementById('update-profile-btn').addEventListener('click', async () => {
        const name = document.getElementById('settings-name').value;
        const email = document.getElementById('settings-email').value;
        
        const response = await fetch('http://localhost:5000/api/settings/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, email })
        });
        
        if (response.ok) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile');
        }
    });

    // Change password
    document.getElementById('change-password-btn').addEventListener('click', async () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        const response = await fetch('http://localhost:5000/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        if (response.ok) {
            alert('Password changed successfully!');
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    });

    // Delete account
    document.getElementById('delete-account-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            const response = await fetch('http://localhost:5000/api/settings/account', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            } else {
                alert('Failed to delete account');
            }
        }
    });
});