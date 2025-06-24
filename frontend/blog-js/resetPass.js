document.getElementById('confirmNewPassword').addEventListener('input', () => {
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    const messageDiv = document.getElementById('message');

    if (newPassword !== confirmNewPassword) {
        messageDiv.textContent = 'Passwords do not match.';
        messageDiv.className = 'message error';
    } else {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }
});



document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const messageDiv = document.getElementById('message');
  const formData = new FormData(event.target);
  
  const newPassword = formData.get('newPassword');
  const confirmNewPassword = formData.get('confirmNewPassword');
  const otp = formData.get('otp');

  // Validate that passwords match
  if (newPassword !== confirmNewPassword) {
      messageDiv.textContent = 'Passwords do not match. Please try again.';
      messageDiv.className = 'message error';
      return;
  }

  const data = { otp, newPassword };

  try {
      const response = await fetch('https://infohub-ffez.onrender.com/api/auth/reset-password', {
          method: 'POST',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      const result = await response.json();
      messageDiv.textContent = result.message;
      messageDiv.className = response.ok ? 'message success' : 'message error';

      if (response.ok) {
          setTimeout(() => {
              window.location.href = '/'; // Redirect to login page
          }, 2000);
      }
  } catch (error) {
      console.error('Error:', error);
      messageDiv.textContent = 'An error occurred. Please try again.';
      messageDiv.className = 'message error';
  }
});