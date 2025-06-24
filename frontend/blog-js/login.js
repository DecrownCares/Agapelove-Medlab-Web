// Open Modal
document.getElementById("openLoginModal").onclick = function() {
  document.getElementById("loginModal").style.display = "block";
};

// Close Modal
document.getElementById("closeModal").onclick = function() {
  document.getElementById("loginModal").style.display = "none";
};

// Close modal if user clicks outside of the modal
window.onclick = function(event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
      modal.style.display = "none";
  }
};


// Base API URL
const BASE_URL = "https://infohub-ffez.onrender.com/api/auth";

// Handle Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Check if response is valid JSON
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
      return document.getElementById("error-message").innerText = "Server response was not valid JSON.";
    }

    if (response.ok) {
      // Store tokens and user information in localStorage
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userRole", data.role);

      document.getElementById("error-message").innerText = "Login Successfully";

      window.location.href = 'index.html';
      
      // Call displayUserInfo after successful login
      displayUserInfo();
    } else {
      console.error("Error response:", data);
      document.getElementById("error-message").innerText = data.message || "Error logging in";
    }
  } catch (error) {
    console.error("Login error:", error);
    document.getElementById("error-message").innerText = "An error occurred while logging in. Please try again.";
  }
});

// Display User Info
function displayUserInfo() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("userRole");

  if (username && role) {
    document.getElementById("username").textContent = username;
    document.getElementById("userRole").textContent = role;
    
    // Hide the login/signup links and show user info
    document.getElementById("userAuth").style.display = "none";
    document.getElementById("userInfo").style.display = "block";
  }
}

// Logout and Clear Local Storage
function logout() {
  localStorage.clear();
  document.getElementById("userInfo").style.display = "none";
  document.getElementById("userAuth").style.display = "block"; // Show login/signup links again
  document.getElementById("error-meassage").innerText = "Logged out successfully!";
}

// Call displayUserInfo when page loads if user is already logged in
window.addEventListener("load", () => {
  displayUserInfo();
});


// Token Refresh
async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (refreshToken) {
    try {
      const response = await fetch(`${BASE_URL}/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      } else {
        alert("Session expired. Please log in again.");
        logout();
      }
    } catch (error) {
      console.error("Token refresh error:", error);
    }
  }
}

// Call refreshToken when page loads if user is already logged in
window.addEventListener("load", () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    displayUserInfo();
    refreshToken();
  }
});

async function secureFetch(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401) { // Token expired
    await refreshToken(); // Try refreshing the token
    accessToken = localStorage.getItem("accessToken");

    options.headers.Authorization = `Bearer ${accessToken}`;
    response = await fetch(url, options); // Retry request with new token
  }

  return response;
}



// Create Post Form Submission
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const videoUrl = document.getElementById("postVideoUrl").value;
  const category = document.getElementById("postCategory").value;
  const tags = document.getElementById("postTags").value.split(",").map(tag => tag.trim());
  const image = document.getElementById("postImage").files[0];

  // Prepare FormData for image upload
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("videoUrl", videoUrl);
  formData.append("categories", category);
  formData.append("tags", JSON.stringify(tags));
  formData.append("image", image);  // Adding the image file

  try {
    const response = await fetch("https://infohub-ffez.onrender.com/api/posts/post", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${accessToken}`, // Authorization header if needed
      },
      body: formData, // Use formData instead of JSON
    });

    const data = await response.json();
    console.log("Post created!")
    alert(data.message || "Post created successfully!");
  } catch (error) {
    console.error("Error creating post:", error);
  }
});

