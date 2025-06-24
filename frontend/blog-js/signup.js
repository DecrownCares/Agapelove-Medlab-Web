// function checkAdminAccess() {
//     const userRole = localStorage.getItem("userRole");
  
//     if (userRole !== "Administrator") {
//       alert("Only administrators can register new users.");
//       window.location.href = "/"; // Redirect to a different page
//     }
//   }
  
//   // Call checkAdminAccess if registration access is restricted to admins only
//   document.addEventListener("DOMContentLoaded", () => {
//     checkAdminAccess();
//   });
  
function showNotificationCenter(message, type = 'warning', position = 'center-overlay', timeout = 5000) {
    const notification = document.getElementById('notification');
    notification.className = `notification ${type} ${position} show`;
    notification.textContent = message;
  
    // Hide notification after timeout
    setTimeout(() => {
      notification.classList.remove('show');
    }, timeout);
  }
  
  function showNotificationTopRight(message, type = 'success', position = 'top-right', timeout = 5000) {
    const notification = document.getElementById('notification');
    notification.className = `notification ${type} ${position} show`;
    notification.textContent = message;
  
    // Hide notification after timeout
    setTimeout(() => {
      notification.classList.remove('show');
    }, timeout);
  }


document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    // const messageElement = document.getElementById('signup-message');
    // messageElement.textContent = '';
  
    let usernameField = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    if (!usernameField || !email || !password || !confirmPassword || !document.getElementById('agree').checked) {
      showNotificationCenter('Hello, All fields are required, and must agree to terms and policy!', 'error');
      return;
  }
  
    // 2. Validate Password Match
    if (password !== confirmPassword) {
        showNotificationCenter('Hello, Passwords do not match.', 'warning');
        return;
    } else {
        messageElement.textContent = '';
    }
  
    // 3. Basic Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotificationCenter('Hello, Please enter a valid email address.', 'warning');
        return;
    }
  
    // Optional: Password strength validation
    if (password.length < 8) {
        showNotificationCenter('Hello, Password must be at least 8 characters.', 'warning');
        return;
    }
  
    // Extract the username and the access code
    const splitResult = usernameField.split('/');
    const username = splitResult[0];
    const code = splitResult[1];
  
    let endpoint = 'https://infohub-ffez.onrender.com/api/reader'; // Default route for a Reader
    let role = 'Reader';
  
    if (code) {
        if (code === '5150') {
            endpoint = 'https://infohub-ffez.onrender.com/api/admin';
            role = 'Admin';
        } else if (code === '1984') {
            endpoint = 'https://infohub-ffez.onrender.com/api/editor';
            role = 'Editor';
        } else if (code === '1985') {
            endpoint = 'https://infohub-ffez.onrender.com/api/author';
            role = 'Editor';
        } else {
            showNotificationCenter('Invalid access code', 'error');
            return;
        }
    }
  
    // Create payload
    const payload = {
        username,
        email,
        password,
    };
  
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
  
        if (response.ok) {
            const result = await response.json();
            // Optional: Display success message with a timeout
            setTimeout(() => {
                showNotificationCenter(`Hello, You are registered successfully as ${username}`, 'success');
              }, 3000);
              clearSignup();
            setTimeout(() => {
                window.location.href = '/';  // Redirect to main system page
              }, 2000);
        } else {
            const errorData = await response.json();
            setTimeout(() => {
                showNotificationCenter(`Registration failed: ${errorData.message || response.statusText}`, 'error');
            }, 4000)
        }
    } catch (error) {
        setTimeout(() => {
            showNotificationCenter(`Error: ${error.message}`, 'error');
        }, 4000);
    }
  });
  
  function clearSignup() {
    const messageElement = document.getElementById('message'); // Define it here as well
    document.getElementById('username').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    messageElement.textContent = '';
  }
  
  // Placeholder for social signup buttons (implement actual functionality if needed)
  document.getElementById('googleSignup').addEventListener('click', function() {
    showNotificationTopRight('Google signup is not implemented.');
  });
  
  document.getElementById('facebookSignup').addEventListener('click', function() {
    showNotificationTopRight('Facebook signup is not implemented.');
  });

// document.getElementById('signupForm').addEventListener('submit', async function (e) {
//     e.preventDefault();

//     // Get form data
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value.trim();
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;
//     const role = document.getElementById('role').value;

//     const passwordError = document.getElementById('passwordError');

//     // 1. Validate Input Fields
//     if (!username || !email || !password || !confirmPassword || !role) {
//         passwordError.textContent = 'Please fill in all fields.';
//         return;
//     }

//     // 2. Validate Password Match
//     if (password !== confirmPassword) {
//         passwordError.textContent = 'Passwords do not match.';
//         return;
//     } else {
//         passwordError.textContent = '';
//     }

//     // 3. Basic Email Format Validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         passwordError.textContent = 'Please enter a valid email address.';
//         return;
//     }

//     // Optional: Password strength validation
//     if (password.length < 8) {
//         passwordError.textContent = 'Password must be at least 8 characters.';
//         return;
//     }

//     // Prepare registration data
//     const registrationData = {
//         username,
//         email,
//         password,
//         role
//     };

//     try {
//         // Send registration request to the backend
//         const response = await fetch('http://localhost:5000/api/auth/register', {
//             method: 'POST',
//             mode: 'cors',
//             credentials: 'same-origin',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(registrationData),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert('Registration successful! Redirecting to profile...');
//             // Redirect to profile page (you can change this URL accordingly)
//             window.location.href = 'index.html';
//         } else {
//             // Display error message
//             passwordError.textContent = result.message || 'Registration failed. Please try again.';
//         }
//     } catch (error) {
//         console.error('Error during registration:', error);
//         passwordError.textContent = 'An error occurred. Please try again.';
//     }
// });

// // Placeholder for social signup buttons (implement actual functionality if needed)
// document.getElementById('googleSignup').addEventListener('click', function() {
//     alert('Google signup is not implemented.');
// });

// document.getElementById('facebookSignup').addEventListener('click', function() {
//     alert('Facebook signup is not implemented.');
// });

