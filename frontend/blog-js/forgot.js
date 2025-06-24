document.getElementById('otpRequestForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form Submitted');  // Add this log
  
    const messageDiv = document.getElementById('message');
    const formData = new FormData(event.target);
    const data = { email: formData.get('email') };
  
    try {
      const response = await fetch('https://infohub-ffez.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      console.log('Response:', response);  // Add this log
  
      const result = await response.json();
      console.log('Response OK:', response.ok);  // Check response status
      console.log('Result:', result);  // Log result
  
      messageDiv.textContent = result.message;
      messageDiv.className = response.ok ? 'message success' : 'message error';
  
      if (response.ok) {
        setTimeout(() => {
          window.location.href = '/new-password'; // Redirect to reset password page
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      messageDiv.textContent = 'An error occurred. Please try again.';
      messageDiv.className = 'message error';
    }
  });

  
  
  function redirectToLogin() {
    window.location.href = '/'; // Redirect to the registration page
  }
  