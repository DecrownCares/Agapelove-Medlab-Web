(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();


  // Initiate the wowjs
  new WOW().init();


  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.sticky-top').addClass('bg-white shadow-sm').css('top', '-1px');
    } else {
      $('.sticky-top').removeClass('bg-white shadow-sm').css('top', '-100px');
    }
  });


  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000
  });


  // Experience
  $('.experience').waypoint(function () {
    $('.progress .progress-bar').each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, { offset: '80%' });


  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });


  // Modal Video
  var $videoSrc;
  $('.btn-play').click(function () {
    $videoSrc = $(this).data("src");
  });
  console.log($videoSrc);
  $('#videoModal').on('shown.bs.modal', function (e) {
    $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
  })
  $('#videoModal').on('hide.bs.modal', function (e) {
    $("#video").attr('src', $videoSrc);
  })


  // Testimonial carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    items: 1,
    loop: true,
    dots: false,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>'
    ]
  });

})(jQuery);


// Set Cookie
// function setCookie(name, value, days) {
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }

// // Get Cookie
// function getCookie(name) {
//   const nameEQ = name + "=";
//   const ca = document.cookie.split(';');
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) === 0)
//       return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// }

// // Delete Cookie (Optional for reset)
// function eraseCookie(name) {
//   document.cookie = name + '=; Max-Age=-99999999;';
// }


// document.addEventListener('DOMContentLoaded', () => {
//   const popup = document.getElementById('notification-popup');
//   const allowBtn = document.getElementById('allow-notifications');
//   const denyBtn = document.getElementById('deny-notifications');

//   // Check if cookie exists
//   const userChoice = getCookie('notificationPermission');

//   if (!userChoice) {
//     // No choice yet, show popup
//     popup.classList.add('show');
//   }

//   allowBtn.addEventListener('click', () => {
//     setCookie('notificationPermission', 'granted', 365); // Cookie valid for 1 year
//     popup.classList.remove('show');
//     askForNotificationPermission();
//   });

//   denyBtn.addEventListener('click', () => {
//     setCookie('notificationPermission', 'denied', 365);
//     popup.classList.remove('show');
//   });
// });

// function askForNotificationPermission() {
//   if ('Notification' in window) {
//     Notification.requestPermission().then(permission => {
//       if (permission === 'granted') {
//         new Notification('Thank you!', {
//           body: 'You’ll now receive updates, promotions & newsletters!',
//           icon: 'img/AMLAD-LOGO.jpg'
//         });
//       }
//     });
//   }
// }


document.addEventListener('DOMContentLoaded', () => {
  const notificationPopup = document.getElementById('notification-popup');
  const allowButton = document.getElementById('allow-notifications');
  const denyButton = document.getElementById('deny-notifications');

  // Utility function to show notification
  function showNotifications(message, type = 'info', position = 'bottom-right', timeout = 5000) {
    const notification = document.getElementById('notification');
    notification.className = `notification ${type} ${position} show`;
    notification.textContent = message;

    // Hide notification after timeout
    setTimeout(() => {
      notification.classList.remove('show');
    }, timeout);
  }

  // Check cookies for user preference
  const notificationPreference = getCookie('notificationPreference');

  if (!notificationPreference) {
    notificationPopup.style.display = 'flex';
  }

  allowButton.addEventListener('click', async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showNotifications('You will now receive notifications!', 'success');
        setCookie('notificationPreference', 'granted', 365);
        registerServiceWorker();
        await subscribeUser();
      } else {
        showNotifications('Notifications were denied!', 'error');
        setCookie('notificationPreference', 'denied', 365);
      }
    } catch (error) {
      showNotifications('An error occurred while enabling notifications.', 'error');
      console.error('Error requesting notification permission:', error);
    }
    notificationPopup.style.display = 'none';
  });

  denyButton.addEventListener('click', () => {
    setCookie('notificationPreference', 'denied', 365);
    notificationPopup.style.display = 'none';
  });
});


async function togglePushNotifications(element) {
  if (element.checked) {
    const permission = await Notification.requestPermission();
  
    if (permission !== 'granted') {
      element.checked = false;
      alert('Push notifications permission denied.');
      return;
    }
  
    const response = await fetch('https://agapelove-medlab-ms.onrender.com/api/posts/get-vapid-key');
    const data = await response.json();
    const publicVapidKey = data.publicVapidKey;
  
    const registration = await navigator.serviceWorker.register('/service-worker.js');
  
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Already subscribed.');
      return;
    }
  
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  
    // Send subscription to server
    await fetch('https://agapelove-medlab-ms.onrender.com/api/posts/subscribe', { // Corrected URL
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
       },
      body: JSON.stringify({ subscription }),
      credentials: "include" // Make sure to include cookies/session!
    });
  
    console.log('User subscribed successfully!');
  }
   else {
    // Unsubscribe logic
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      // Inform server to remove subscription
      await fetch('https://agapelove-medlab-ms.onrender.com/api/posts/unsubscribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
         },
        body: JSON.stringify({ subscription }),
        credentials: "include"
      });
    }
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

window.addEventListener('load', async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    document.getElementById('settings-switch-2').checked = true;
  } else {
    document.getElementById('settings-switch-2').checked = false;
  }
});



function showNotification(title, options) {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }
  return null;
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }
}


async function subscribeUser() {
  try {
    const response = await fetch('https://agapelove-medlab-ms.onrender.com/api/posts/get-vapid-key');
    const data = await response.json();

    const publicVapidKey = data.publicVapidKey;

    if (!publicVapidKey) {
      throw new Error('Public VAPID key is not available');
    }

    const registration = await navigator.serviceWorker.register('/service-worker.js');

    // Get existing subscription
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      console.log('Existing subscription found:', existingSubscription);

      // Unsubscribe if the applicationServerKey is different
      const currentKey = urlBase64ToUint8Array(publicVapidKey);

      if (existingSubscription.options.applicationServerKey !== currentKey.buffer) {
        console.log('Unsubscribing from previous subscription...');
        await existingSubscription.unsubscribe();
      } else {
        console.log('Existing subscription has correct applicationServerKey.');
        return;
      }
    }

    // Subscribe the user with the correct VAPID key
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });

    // Send the subscription object to the backend
    await fetch('https://agapelove-medlab-ms.onrender.com/api/posts/visitor-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription })
    });

    console.log('User subscribed successfully!');
  } catch (error) {
    console.error('Error subscribing user:', error);
  }
}


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4); // Add padding if needed
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/'); // Ensure it's in URL-safe format

  const rawData = atob(base64); // Decode base64 to raw binary
  const outputArray = new Uint8Array(rawData.length); // Create a Uint8Array for the raw binary data

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i); // Fill the Uint8Array
  }

  return outputArray; // Return the converted Uint8Array
}


document.addEventListener('DOMContentLoaded', function () {
  fetchNotifications(); // Move fetch into a reusable function
});

// Function to fetch & render notifications
function fetchNotifications() {
  fetch('https://agapelove-medlab-ms.onrender.com/api/notifications/get-notifications', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
    },
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const list = document.getElementById('notificationList');
        const countBadge = document.getElementById('notificationCount');
        let unreadCount = 0;

        list.innerHTML = '';

        data.data.forEach(notification => {
          if (!notification.isRead) unreadCount++;

          const notifItem = document.createElement('div');
          notifItem.classList.add('item', 'p-3');
          notifItem.style.position = 'relative'; // Ensure relative for link-mask

          notifItem.innerHTML = `
            <div class="row gx-2 justify-content-between align-items-center">
              <div class="col-auto">
                <img class="profile-image" src="/images/notification.jpg" alt="">
              </div>
              <div class="col">
                <div class="info">
                  <div class="desc">${notification.message}</div>
                  <div class="meta">${formatTimeAgo(notification.createdAt).toLocaleString()} <br> <div class="col-auto">
                ${notification.isRead ? '' : '<span class="badge bg-success">New</span>'}
              </div>
                  </div>
                </div>
              </div>
              
            </div>
            <a class="link-mask" href="${notification.link}" data-id="${notification._id}"></a>
            <button class="btn btn-sm btn-link text-danger clear-btn" data-id="${notification._id}">Clear</button>
          `;

          list.appendChild(notifItem);
        });

        countBadge.textContent = unreadCount;
      }
    });
}

// Mark as read & clear functionality
document.addEventListener('click', function (e) {
  // Mark as read
  if (e.target.closest('.link-mask')) {
    const notifId = e.target.closest('.link-mask').dataset.id;
    fetch(`https://agapelove-medlab-ms.onrender.com/api/notifications/read/${notifId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
      credentials: 'include'
    }).then(() => {
      // Optional: Could refetch or just leave it since badge count will update next time
    });
  }

  // Clear notification
  if (e.target.classList.contains('clear-btn')) {
    e.preventDefault();
    e.stopPropagation(); // 🚩 This prevents the dropdown from closing

    const notifId = e.target.dataset.id;
    fetch(`https://agapelove-medlab-ms.onrender.com/api/notifications/clear/${notifId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          // Smooth fade-out animation before removing
          const item = e.target.closest('.item');
          item.style.transition = 'opacity 0.3s ease';
          item.style.opacity = 0;
          setTimeout(() => item.remove(), 300);

          // Update count without reloading
          fetchNotifications();
        }
      });
  }
});

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
      "yr": 31536000, "month": 2592000, "wk": 604800,
      "day": 86400, "hr": 3600, "min": 60, "second": 1
  };
  for (const unit in intervals) {
      const count = Math.floor(seconds / intervals[unit]);
      if (count > 0) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}


function accessNotification(message) {
  document.getElementById("notificationMessage").innerText = message;
  let notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"));
  notificationModal.show();
}

async function loadPage(url) {
  const token = localStorage.getItem('accessToken'); // Get JWT token
  const userRole = localStorage.getItem('userRole'); // Get role

  if (!token) {
    accessNotification("No access token found. Please log in.");
    return;
  }

  if (!userRole || (userRole !== 'Admin' && userRole !== 'Director')) {
    accessNotification("Access Denied: Only Admins and Directors can view this page.");
    return;
  }

  // Redirect to the page if access is allowed
  window.location.href = url;
}


// Toggle chat window
const chatButton = document.getElementById("chat-button");
const chatWindow = document.getElementById("chat-window");
const closeChat = document.querySelector(".close-chat");
const startChatBtn = document.getElementById("startChatBtn");

let inactivityTimer;

function startInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    chatWindow.classList.remove("active");
  }, 20000); // 30 seconds
}

// Start/Reset timer when chat opens
chatButton.addEventListener("click", function () {
  chatWindow.classList.toggle("active");

  const typingIndicator = document.querySelector(".typing-indicator");
  const labMessage = document.querySelector(".lab-message");

  if (chatWindow.classList.contains("active")) {
    // Reset visibility
    typingIndicator.style.display = "flex";
    labMessage.style.display = "none";

    document.getElementById("chatSound").play();
    startInactivityTimer();

    // After 2 seconds, show message and hide typing
    setTimeout(() => {
      typingIndicator.style.display = "none";
      labMessage.style.display = "block";
    }, 3000);
  } else {
    clearTimeout(inactivityTimer);
  }


  if (chatWindow.classList.contains("active")) {
    document.getElementById("chatSound").play();
    startInactivityTimer();
  } else {
    clearTimeout(inactivityTimer);
  }
});

// Reset timer when interacting (optional)
chatWindow.addEventListener("mouseover", startInactivityTimer);



closeChat.addEventListener("click", function () {
  chatWindow.classList.remove("active");
});

startChatBtn.addEventListener("click", function () {
  const phoneNumber = "2347048705012";
  const message = encodeURIComponent("Hello! I would like to inquire about your lab services.");
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappURL, "_blank");
});




function displayUserInfo() {
  const username = localStorage.getItem("username");
  const patientId = localStorage.getItem("patientId");
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");
  document.getElementById('user-info').textContent = `Welcome, ${username}!`;
  document.getElementById('patientId').textContent = `${patientId}!`;
  document.getElementById('userRole').textContent = `${userRole}`;
  document.getElementById('user-info').style.display = 'block';
  document.getElementById('logoutButton').style.display = 'block';
  document.getElementById('loginButton').style.display = 'none';
}

displayUserInfo();

function logout() {
  localStorage.clear(); // Clear user data
  showNotificationTopRight("Logged out successfully.", 'success');
  fetch("http://localhost:3270/api/logout", { method: "GET", credentials: "include" }) // Inform the server
    .finally(() => {
      window.location.href = "/patient-login"; // Redirect to login page
    });
}
function logOut() {
  localStorage.clear(); // Clear user data
  showNotificationTopRight("Logged out successfully.", 'success');
  fetch("http://localhost:3270/api/logout", { method: "GET", credentials: "include" }) // Inform the server
    .finally(() => {
      window.location.href = "/patient-login"; // Redirect to login page
    });
}


document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3270/api/logout", {
      method: "GET", // Ensure this matches the server route handling
      credentials: 'include' // Include cookies in the request
    });

    if (response.status === 204) {
      localStorage.clear(); // Clear user data
      showNotificationTopRight("Logged out successfully.", 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      showNotificationBottomRight("Logout failed. Please try again.", 'error');
    }
  } catch (error) {
    console.error("Logout error:", error);
    showNotificationBottomRight("An error occurred while logging out.", 'error');
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const placeholders = {
    1: document.querySelector('.first-ad'),
    2: document.querySelector('.second-ad'),
    3: document.querySelector('.potriate-ads'),
  };

  // Predefined CTA buttons
  const ctaButtons = ["Call Now", "Visit", "Buy Now", "Click Link", "Learn More"];

  async function fetchAds() {
    try {
      const response = await fetch('https://agapelove-medlab-ms.onrender.com/api/ads/get');
      const ads = await response.json();
      Object.keys(ads).forEach((key) => {
        setupAdRotation(key, ads[key]);
      });
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  }

  function setupAdRotation(placeholderId, ads) {
    const container = placeholders[placeholderId];
    if (!container) return;

    let index = 0;

    function rotateAds() {
      if (ads.length === 0) {
        if (placeholderId === '3') {
          container.classList.add('show-default');
        } else {
          container.innerHTML = `
          <div class="default-ad">
            <p>Advertise Your Brand Here</p>
          </div>`;
        }
        return;
      }

      const ad = ads[index];
      const randomCTA = ctaButtons[Math.floor(Math.random() * ctaButtons.length)];
      container.innerHTML = `
              <div class="ad-wrapper">
          <a href="${ad.targetUrl}" target="_blank" class="ad-link">
            <img loading="lazy" decoding="async" src="https://agapelove-medlab-ms.onrender.com${ad.imageUrl}" alt="Ad Banner" title="Click to visit - ${ad.targetUrl}">
          </a>
          <div class="ad-description">
            <p>${ad.description || "Discover what we have to offer!"}</p>
            <button class="cta-btn" onclick="window.open('${ad.targetUrl}', '_blank')">${randomCTA}</button>
          </div>
        </div>
          `;
      index = (index + 1) % ads.length;
      setTimeout(rotateAds, 30000); // Rotate every 30 seconds
    }

    rotateAds();
  }

  fetchAds();
});


// document.addEventListener("DOMContentLoaded", function () {
//   const adModal = new bootstrap.Modal(document.getElementById("adModal"));

//   // Show ad after 10 seconds
//   setTimeout(() => {
//     adModal.show();
//   }, 10000);

//   // Reappear every 5 minutes (300,000ms)
//   setInterval(() => {
//     adModal.show();
//   }, 300000);
// });

