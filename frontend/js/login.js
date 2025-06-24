// Base API URL
const BASE_URL = "http://localhost:3270/api/auth";

function showNotificationCenter(message, type = 'warning', position = 'center-overlay', timeout = 5000) {
  const notification = document.getElementById('notification');
  notification.className = `notification ${type} ${position} show`;
  notification.textContent = message;

  // Hide notification after timeout
  setTimeout(() => {
    notification.classList.remove('show');
  }, timeout);
}
function showNotificationBottomRight(message, type = 'error', position = 'bottom-right', timeout = 5000) {
  const notification = document.getElementById('notification');
  notification.className = `notification ${type} ${position} show`;
  notification.textContent = message;

  // Hide notification after timeout
  setTimeout(() => {
    notification.classList.remove('show');
  }, timeout);
}
function showNotificationBottomLeft(message, type = 'info', position = 'bottom-left', timeout = 5000) {
  const notification = document.getElementById('notification');
  notification.className = `notification ${type} ${position} show`;
  notification.textContent = message;

  // Hide notification after timeout
  setTimeout(() => {
    notification.classList.remove('show');
  }, timeout);
}

// Utility function to show notification
function showNotificationTopRight(message, type = 'success', position = 'top-right', timeout = 5000) {
  const notification = document.getElementById('notification');
  notification.className = `notification ${type} ${position} show`;
  notification.textContent = message;

  // Hide notification after timeout
  setTimeout(() => {
    notification.classList.remove('show');
  }, timeout);
}

document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!identifier || !password) {
    showNotificationBottomLeft("Please enter your email/phone and password.", 'error')
    return;
  }

  showLoading();

  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
      credentials: "include"
    });

    let result;
    if (response.headers.get('content-type')?.includes('application/json')) {
      result = await response.json();
      console.log("Login result:", result);
      
    } else {
      const text = await response.text(); // Fallback for non-JSON response
      throw new Error(text || 'Unexpected response format');
    }

    // const result = await response.json();

    if (response.ok) {
      const { user, accessToken } = result; 
      const role = user?.role;
      if (user && accessToken && role) {
        localStorage.setItem("username", user.fullName || "Unknown");
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("patientId", user.labPatientId);
        localStorage.setItem("userRole", role);
        localStorage.setItem("accessToken", accessToken);

        // showNotificationCenter("Login successful. Redirecting...", 'success')
        setTimeout(() => {
          hideLoading();
          clearLogin(); 
          showSuccessMessage();
        }, 2000);

        setTimeout(() => {
          window.location.href = "/patient-account";
        }, 5000);

         displayUserInfo();
      } else {
        hideLoading();
        showNotificationBottomLeft("Invalid user data. Please try again.", 'error')
      }
    } else {
      hideLoading();
      showNotificationBottomLeft(result.message || "Invalid email or password!", 'error')
    }
  } catch (error) {
    hideLoading();
    console.error("Login Error:", error);
    // showNotificationBottomLeft("An error occurred. Please try again.", 'error')
  }
});


function clearLogin() {
  document.getElementById('identifier').value = '';
  document.getElementById('password').value = '';
}


function displayUserInfo() {
  const username = localStorage.getItem("username");
  const labPatientId = localStorage.getItem("labPatientId");
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");
  document.getElementById('user-info').textContent = `Welcome, ${username}!`;
  document.getElementById('patientId').textContent = `${labPatientId}!`;
  document.getElementById('userRole').textContent = `${userRole}`;
  document.getElementById('user-info').style.display = 'block';
  document.getElementById('logoutButton').style.display = 'block';
  document.getElementById('loginButton').style.display = 'none';
}


// // Token Refresh
async function refreshToken() {
  try {
    const response = await fetch(`${BASE_URL}/refresh`, {
      method: "GET",
      credentials: "include", // Send cookies
    });

    console.log("Refresh response:", response); // Log the response object

    const data = await response.json();
    console.log("Refresh data:", data); // Log the parsed response data

    if (response.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      console.log("Access token updated.");
    } else {
      console.error("Session expired or invalid refresh token.");
      showNotificationCenter("Session expired. Please log in again.", "error");
      logout();
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    // console.error("An error occurred. Please log in again.");
    // logout();
  }
}


// Call refreshToken when the page loads if the user is already logged in
window.addEventListener("load", () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    refreshToken();
  }
});

function showLoading() {
  document.getElementById('loadingIndicator').classList.remove('d-none');
}

function hideLoading() {
  document.getElementById('loadingIndicator').classList.add('d-none');
}

function showSuccessMessage() {
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  successModal.show();
}