function formatPostDate(date) {
  const currentTime = new Date();
  const timeDifference = currentTime - date; // Difference in milliseconds
  const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (timeDifference < oneDayInMs) {
    // If less than 24 hours, include time of publish
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else {
    // If more than 24 hours, show only the date
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const roleCardsContainer = document.getElementById("role-cards-container");
  const roleFilter = document.getElementById("role-filter");
  const applicationModal = document.getElementById("application-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const applicationForm = document.getElementById("application-form");
  const appliedRoleInput = document.getElementById("applied-role");
  const applyingRole = document.getElementById("role");

  let roles = [];

  // Fetch roles data
  fetch("Js/vacancyApp.json")
    .then((response) => response.json())
    .then((data) => {
      roles = data;
      generateRoleCards("all");
    })
    .catch((error) => console.error("Error loading roles data:", error));

  // Function to generate role cards
  function generateRoleCards(filter) {
      roleCardsContainer.innerHTML = "";
      const normalizedFilter = filter.toLowerCase();

      const filteredRoles = normalizedFilter === "all"
          ? roles
          : roles.filter(role => role.role.toLowerCase() === normalizedFilter);

      filteredRoles.forEach((role) => {
          const card = document.createElement("div");
          card.className = "role-card";
          card.innerHTML = `
              <h2>${role.role}</h2>
              <p><strong>Description:</strong> ${role.description}</p>
              <p><strong>Responsibilities:</strong></p>
              <ul>${role.responsibilities.map(r => `<li>${r}</li>`).join("")}</ul>
              <p><strong>Requirements:</strong></p>
              <ul>${role.requirements.map(r => `<li>${r}</li>`).join("")}</ul>
              <button class="apply-btn" data-role="${role.role}">Apply Now</button>
          `;
          roleCardsContainer.appendChild(card);
      });
  }

  // Open application modal
  function openApplicationModal(role) {
      appliedRoleInput.value = role;
      applyingRole.textContent = role;
      applicationModal.style.display = "block";
  }

  // Close application modal
  function closeApplicationModal() {
      applicationModal.style.display = "none";
      applicationForm.reset();
  }

  // Event listeners
  roleCardsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("apply-btn")) {
          const role = e.target.getAttribute("data-role");
          openApplicationModal(role);
      }
  });

  closeModalBtn.addEventListener("click", closeApplicationModal);

  window.addEventListener("click", (event) => {
      if (event.target === applicationModal) {
          closeApplicationModal();
      }
  });

  roleFilter.addEventListener("change", (e) => {
      generateRoleCards(e.target.value);
  });
});


document.getElementById("application-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("applicant-name").value);
  formData.append("email", document.getElementById("applicant-email").value);
  formData.append("role", document.getElementById("applied-role").value);
  formData.append("message", document.getElementById("applicant-message").value);
  formData.append("resume", document.getElementById("applicant-resume").files[0]);

  if (!formData.get("name") ||!formData.get("email") ||!formData.get("role") ||!formData.get("message") ||!formData.get("resume")) {
      showNotificationCenter("Please fill out all required fields.", 'error');
      return;
  }

  try {
      const response = await fetch("http://infohub-ffez.onrender.com/api/applications/apply", {
          method: "POST",
          body: formData,
      });

      const result = await response.json();
      showNotificationCenter(result.message, 'success');
      if (response.ok) document.getElementById("application-form").reset();
  } catch (error) {
      console.error("Submission error:", error);
      showNotificationCenter("Failed to submit application. Try again later.", 'error');
  }
});



  




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
      const response = await fetch('https://infohub-ffez.onrender.com/api/posts/get-vapid-key');
      const data = await response.json();
      
      // Log the response to ensure we get the correct key
      console.log('Fetched public VAPID key:', data.publicVapidKey);
  
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
      await fetch('https://infohub-ffez.onrender.com/api/posts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
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
  
  
  const adSection = document.getElementById('ads-section');
  
  const adContainer = document.createElement('div');
  adContainer.className = 'ad-container';
  adContainer.innerHTML = `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <ins class="adsbygoogle"
         style="display:block;"
         data-ad-client="ca-pub-XXXXXXXXXXXX"
         data-ad-slot="1234567890"
         data-ad-format="auto"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  `;
  
  adSection.appendChild(adContainer);
  
  // Floating Ad Section
  const adFloatSection = document.getElementById('floating-ad-container');
  
  // Create Ad Content
  const adContent = document.createElement('div');
  adContent.className = 'ad-content';
  
  // Google AdSense Unit
  const googleAd = document.createElement('script');
  googleAd.async = true;
  googleAd.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  
  const googleAdIns = document.createElement('ins');
  googleAdIns.className = "adsbygoogle";
  googleAdIns.style.display = "block";
  googleAdIns.setAttribute("data-ad-client", "ca-pub-XXXXXXXXXXXX");
  googleAdIns.setAttribute("data-ad-slot", "1234567890");
  googleAdIns.setAttribute("data-ad-format", "auto");
  
  // Media.net Unit
  const mediaNetAd = document.createElement('script');
  mediaNetAd.async = true;
  mediaNetAd.src = "https://contextual.media.net/nmedianet.js?cid=YOUR_MEDIA_NET_ID";
  
  const mediaNetIns = document.createElement('ins');
  mediaNetIns.className = "adsbygoogle";
  mediaNetIns.style.display = "block";
  mediaNetIns.setAttribute("data-ad-client", "YOUR_MEDIA_NET_CLIENT_ID");
  mediaNetIns.setAttribute("data-ad-slot", "YOUR_MEDIA_NET_SLOT_ID");
  
  // Amazon Native Ad (Example)
  const amazonAd = document.createElement('script');
  amazonAd.async = true;
  amazonAd.src = "https://aax-eu.amazon-adsystem.com/e/dtb/manifest?dsp=true&tag=YOUR_AMAZON_TAG";
  
  // Append ads
  adContent.appendChild(googleAd);
  adContent.appendChild(googleAdIns);
  adContent.appendChild(mediaNetAd);
  adContent.appendChild(mediaNetIns);
  adContent.appendChild(amazonAd);
  
  // Close Button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = 'Close Ad';
  closeButton.className = 'close-ad-btn';
  closeButton.onclick = () => {
    adFloatSection.style.display = 'none';
    restoreMenuButtonState();
  };
  
  adContent.appendChild(closeButton);
  
  // Append the ad content to the floating section
  adFloatSection.appendChild(adContent);
  
  
  
  // Function to show the floating ad
  function showFloatingAd() {
    const adContainer = document.getElementById("floating-ad");
    const overlay = document.getElementById("overlay");
    const closeButton = document.getElementById("close-ad");
  
    // Show the ad and overlay
    adContainer.style.display = "block";
    overlay.style.display = "block";
  
    // Close the ad when the close button is clicked
    closeButton.addEventListener("click", () => {
      adContainer.style.display = "none";
      overlay.style.display = "none";
      restoreMenuButtonState();
  
      // Reappear after 5 minutes
      setTimeout(showFloatingAd, 300000); // 300000ms = 5 minutes
    });
  
    // Auto-close after 10 seconds (optional)
    setTimeout(() => {
      adContainer.style.display = "none";
      overlay.style.display = "none";
      restoreMenuButtonState();
  
      // Reappear after 5 minutes
      setTimeout(showFloatingAd, 300000);
    }, 10000); // 10000ms = 10 seconds
  }
  
  // Show the floating ad when the page loads
  window.addEventListener("load", showFloatingAd);
  
  // Function to show the side ad
  function showSideAd() {
    const adContainer = document.getElementById("side-ad");
    const closeButton = document.getElementById("close-side-ad");
  
    // Show the side ad
    adContainer.style.display = "block";
  
    // Close the ad when the close button is clicked
    closeButton.addEventListener("click", () => {
        adContainer.style.display = "none";
        restoreMenuButtonState();
    });
  }
  
  // Show the side ad when the page loads
  window.addEventListener("load", showSideAd);
  
  
  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem('accessToken'); // Assuming JWT stored here
  
      const response = await fetch('https://infohub-ffez.onrender.com/api/user/profile/{userId}', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Ensure correct token format
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
  
        // Dynamically update the avatar based on user type
        if (userData.type === 'Reader') {
          document.getElementById('reader-current-avatar').src =
            userData.avatar || './images/ImgUnavailable.jpeg';
          document.getElementById('readerName').style.display = 'block';
          document.getElementById('userInfo').style.display = 'none';
        } else if (userData.type === 'Admin' || userData.type === 'Editor' || userData.type === 'Author') {
          document.getElementById('current-avatar').src =
            userData.avatar || './images/ImgUnavailable.jpeg';
          // document.getElementById('userInfo').style.display = 'block';
        }
  
        // Update other user-related UI elements
        document.getElementById('reader').textContent = userData.username;
        document.getElementById('username').textContent = userData.username;
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  async function fetchSmallUserProfile() {
    try {
      const token = localStorage.getItem('accessToken'); // Assuming JWT stored here
  
      const response = await fetch('https://infohub-ffez.onrender.com/api/user/profile/{userId}', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Ensure correct token format
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
  
        // Dynamically update the avatar based on user type
        if (userData.type === 'Reader') {
          document.getElementById('small-reader-current-avatar').src =
            userData.avatar || './images/ImgUnavailable.jpeg';
          document.getElementById('small-readerName').style.display = 'block';
          document.getElementById('small-userInfo').style.display = 'none';
        } else if (userData.type === 'Admin' || userData.type === 'Editor' || userData.type === 'Author') {
          document.getElementById('small-current-avatar').src =
            userData.avatar || './images/ImgUnavailable.jpeg';
          // document.getElementById('userInfo').style.display = 'block';
        }
  
        // Update other user-related UI elements
        document.getElementById('small-reader').textContent = userData.username;
        document.getElementById('small-username').textContent = userData.username;
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  
  
  
  //mall Menu Toggle
          // Menu Toggle
          document.addEventListener("DOMContentLoaded", function () {
              // Toggle main dropdown
              const toggleButton = document.querySelector('.dropdown-toggle');
              const dropdownMenu = document.querySelector('.dropdown-menu');
              const menuIcon = document.querySelector('.menu-icon');
              const closeIcon = document.querySelector('.close-icon');
  
              toggleButton.addEventListener('click', function (event) {
                  event.stopPropagation(); // Prevent the event from bubbling up to document
                  dropdownMenu.classList.toggle('open');
                  menuIcon.style.display = menuIcon.style.display === 'none' ? 'block' : 'none';
                  closeIcon.style.display = closeIcon.style.display === 'none' ? 'block' : 'none';
              });
  
              // Toggle sub-menu
              document.querySelectorAll('.menu-item-children > a').forEach(function (menuItem) {
                  menuItem.addEventListener('click', function (event) {
                      event.preventDefault(); // Prevent the default link behavior
                      event.stopPropagation(); // Prevent the event from bubbling up to document
                      const parentMenuItem = this.parentElement;
                      parentMenuItem.classList.toggle('open');
                  });
              });
  
              // Close dropdowns if clicked outside
              document.addEventListener('click', function (event) {
                  if (!dropdownMenu.contains(event.target) && !toggleButton.contains(event.target)) {
                      dropdownMenu.classList.remove('open');
                      menuIcon.style.display = 'block';
                      closeIcon.style.display = 'none';
                  }
                  document.querySelectorAll('.menu-item-children.open').forEach(function (menuItem) {
                      if (!menuItem.contains(event.target)) {
                          menuItem.classList.remove('open');
                      }
                  });
              });
          });
  
          // small mode toggle 
          // mode toggle js code
  
  document.getElementById('header-mode-toggle-checkbox').addEventListener('change', function () {
      const outerDivs = document.querySelectorAll('.outer-div');
      if (this.checked) {
          outerDivs.forEach(div => {
              div.classList.remove('light-mode');
              div.classList.add('dark-mode');
          });
      } else {
          outerDivs.forEach(div => {
              div.classList.remove('dark-mode');
              div.classList.add('light-mode');
          });
      }
  });
  
  
          // small search bar toggle 
          document.addEventListener('DOMContentLoaded', () => {
            const searchIcon = document.querySelector('.small-search-icon');
            const cancelIcon = document.querySelector('.small-cancel-icon');
            const searchContainer = document.querySelector('.small-search-container');
            const searchInput = document.querySelector('#small-SearchInput');
            const resultsContainer = document.getElementById('smallSearchResults'); // Container for small screen results
            const spinner = document.getElementById("rotating-search-spinner");
          
            async function searchPosts() {
              const searchTerm = searchInput.value.trim();
              console.log("Search Term:", searchTerm);
              
              if (!searchTerm) {
                resultsContainer.style.display = 'none';
                return;
              } else {
                resultsContainer.style.display = 'block';
                spinner.style.display = 'flex';
              }
          
              let searchTimeout;
              clearTimeout(searchTimeout);
              searchTimeout = setTimeout(async () => {
                try {
                  const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/search?term=${encodeURIComponent(searchTerm)}`);
                  const posts = await response.json();
                  displayPosts(posts, searchTerm); // Pass search term for highlighting
                } catch (error) {
                  console.error("Error searching posts:", error);
                  resultsContainer.innerHTML = `<p class="noResults">Error: ${error.message}</p>`;
                } finally {
                  // Hide the spinner after the results are ready
                  spinner.style.display = 'none';
                }
              }, 2000); // 2s debounce
            }
          
            function highlightKeyword(text, keyword) {
              if (typeof text !== 'string') return '';
              const regex = new RegExp(`(${keyword})`, "gi");
              return text.replace(regex, "<span class='highlight'>$1</span>");
            }
          
            function displayPosts(posts, searchTerm) {
              console.log("Posts Received:", posts);
              resultsContainer.innerHTML = '';
              resultsContainer.style.display = 'block';
          
              if (!posts || posts.length === 0) {
                showNotificationBottomRight("No results found.", 'info');
                resultsContainer.innerHTML = '<p class="noResults">No results found</p>';
                return;
              }
          
              posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-item');
          
                const imageUrl = post.image ? `https://infohub-ffez.onrender.com${post.image}` : 'default-image-path.jpg';
                const briefContent = stripHtmlTags(post.content || '').substring(0, 100);
                const sponsoredLabel = post.isSponsored
                  ? '<div class="hero-sponsored-label"><i class="fas fa-bullhorn"></i>&nbsp; Sponsored</div>'
                  : '';
          
                postElement.innerHTML = `
                  <div class="post-item-image">
                  ${sponsoredLabel}
                    <img src="${imageUrl}" alt="${post.title}" />
                  </div>
                  <div class="post-item-content">
                    <a href="/api/posts/post/${post.slug}">${highlightKeyword(post.title, searchTerm)}</a>
                    <p>${highlightKeyword(briefContent, searchTerm)}...</p>
                    <span>${post.categories || ''} | ${(post.tags && post.tags.join(', ')) || ''}</span>
                    <span> | By: ${post.author.username || ''} | ${formatPostDate(new Date(post.createdAt))}</span>
                  </div>
                `;
          
                resultsContainer.appendChild(postElement);
              });
            }
          
            searchIcon.addEventListener('click', function (event) {
              event.stopPropagation();
              if (searchContainer.classList.contains('expanded')) {
                if (searchInput.value) {
                  searchPosts(); // Search when expanded and input has value
                } else {
                  searchContainer.classList.remove('expanded');
                  searchInput.blur();
                  resultsContainer.style.display = 'none'; // Hide results when search closes
                  restoreMenuButtonState();
                }
              } else {
                searchContainer.classList.add('expanded');
                searchInput.focus();
              }
            });
          
            cancelIcon.addEventListener('click', function (event) {
              event.stopPropagation();
              searchInput.value = '';
              searchContainer.classList.remove('expanded');
              searchInput.blur();
              resultsContainer.style.display = 'none'; // Hide results when cancel is clicked
              restoreMenuButtonState();
            });
          
            searchInput.addEventListener('keyup', searchPosts);
          
            // Hide search and results on clicking outside
            window.addEventListener('click', function (event) {
              if (!searchContainer.contains(event.target) && !resultsContainer.contains(event.target)) {
                searchContainer.classList.remove('expanded');
                searchInput.blur();
                resultsContainer.style.display = 'none';
                restoreMenuButtonState();
              }
            });
          });
          
          
          function stripHtmlTags(input) {
            const div = document.createElement('div');
            div.innerHTML = input;
            return div.textContent || div.innerText || '';
          }
  
          
          // small header hide and fixed ticker 

let prevScrollpos = window.pageYOffset;

function handleScroll() {
  const currentScrollPos = window.pageYOffset;
  const smallScreenHeader = document.querySelector('.small-screen-header');
  const desktopHeader = document.querySelector('.main-screen-header');
  const tickerContainer = document.querySelector('.main-ticker-nav');
  const smallTickerContainer = document.querySelector('.small-main-ticker-nav');
  const smallAdHeader = document.querySelector('.small-ad-header');
  const smallSearchContainer = document.querySelector('.small-search-container');

  // Determine if scrolled to the top of the page
  const isAtTop = currentScrollPos === 0;

  if (isAtTop) {
    // Reset to normal styles at the top of the page
    if (smallScreenHeader) {
      smallScreenHeader.style.top = "0";
      smallScreenHeader.style.position = "relative";
      smallScreenHeader.style.width = "100%";
      smallAdHeader.style.display = "block";
      smallSearchContainer.style.top = "25px";

      if (window.matchMedia("(min-width: 481px) and (max-width: 1023px)").matches) {
        if (smallScreenHeader) {
          smallScreenHeader.style.top = "0"; // Adjust negative top for tablets
          smallScreenHeader.style.position = "fixed";
          smallScreenHeader.style.width = "99%";
          smallAdHeader.style.display = "block";
          smallSearchContainer.style.top = "35px";
        }
      }

      if (window.matchMedia("(min-width: 1024px) and (max-width: 1025px)").matches) {
        if (smallScreenHeader) {
          smallScreenHeader.style.top = "0"; // Adjust negative top for mobile screens
          smallScreenHeader.style.position = "fixed";
          smallScreenHeader.style.width = "90%";
          smallAdHeader.style.display = "block";
          smallSearchContainer.style.top = "35px";
        }
      }
    }
    if (desktopHeader) {
      desktopHeader.style.top = "0";
      desktopHeader.style.position = "relative";
      desktopHeader.style.width = "100%";
    }
    if (smallTickerContainer) {
      smallTickerContainer.style.display = "flex"; // Ensure ticker is visible
    }
    if (tickerContainer) {
      tickerContainer.style.display = "flex"; // Ensure ticker is visible
    }
  } else if (prevScrollpos > currentScrollPos) {
    // Scrolling up - keep headers visible
    if (smallScreenHeader) {
      smallScreenHeader.style.top = "0";
      smallScreenHeader.style.position = "fixed";
      smallScreenHeader.style.width = "97.5%";
      smallTickerContainer.style.display = "flex";
      smallSearchContainer.style.top = "15px";
      // smallAdHeader.style.display = "none";

      if ( window.matchMedia("(min-width: 481px) and (max-width: 1023px)").matches) {
        if (smallScreenHeader) {
          smallScreenHeader.style.top = "0"; // Adjust negative top for tablets
          smallScreenHeader.style.position = "fixed";
          smallScreenHeader.style.width = "99%";
          smallAdHeader.style.display = "none";
          smallTickerContainer.style.display = "flex";
          smallSearchContainer.style.top = "35px";
        }
      } else {
        if (window.matchMedia("(min-width: 1024px) and (max-width: 1025px)").matches) {
          if (smallScreenHeader) {
            smallScreenHeader.style.top = "0"; // Adjust negative top for mobile screens
            smallScreenHeader.style.position = "fixed";
            smallScreenHeader.style.width = "90%";
            smallAdHeader.style.display = "none";
            smallTickerContainer.style.display = "flex";
            smallSearchContainer.style.top = "35px";
          }
        }
      }
    }
    if (desktopHeader) {
      desktopHeader.style.top = "-280px";
      desktopHeader.style.position = "fixed";
      desktopHeader.style.width = "90%";
    }
    if (tickerContainer) {
      tickerContainer.style.display = "flex";
    }
  } else {
    // Scrolling down - hide headers
    if (window.matchMedia("(max-width: 480px)").matches) {
      if (smallScreenHeader) {
        smallScreenHeader.style.top = "0"; // Adjust negative top for mobile
        smallScreenHeader.style.position = "fixed";
        smallScreenHeader.style.width = "97.5%";
        smallAdHeader.style.display = "none";
        smallTickerContainer.style.display = "none";
        smallSearchContainer.style.top = "15px";
      }
    } else if (window.matchMedia("(min-width: 481px) and (max-width: 1023px)").matches) {
      if (smallScreenHeader) {
        smallScreenHeader.style.top = "0"; // Adjust negative top for tablets
        smallScreenHeader.style.position = "fixed";
        smallScreenHeader.style.width = "99%";
        smallAdHeader.style.display = "none";
        smallTickerContainer.style.display = "none";
        smallSearchContainer.style.top = "35px";
      }
    } else if (window.matchMedia("(min-width: 1024px) and (max-width: 1025px)").matches) {
      if (smallScreenHeader) {
        smallScreenHeader.style.top = "0"; // Adjust negative top for mobile screens
        smallScreenHeader.style.position = "fixed";
        smallScreenHeader.style.width = "90%";
        smallAdHeader.style.display = "none";
        smallTickerContainer.style.display = "none";
        smallSearchContainer.style.top = "35px";
      }
    } else {
      if (desktopHeader) {
        desktopHeader.style.top = "-280px"; // Adjust negative top for desktop
        desktopHeader.style.position = "fixed";
        desktopHeader.style.width = "90%"; // Adjust width for desktop
      }
      if (tickerContainer) {
        tickerContainer.style.display = "none"; // Hide ticker when scrolling down
      }
    }
  }

  prevScrollpos = currentScrollPos; // Update previous scroll position
}

// Attach scroll event listener
window.addEventListener("scroll", handleScroll);
  
  
          // comment menu js code 
  
  // script.js
  document.addEventListener('DOMContentLoaded', function() {
      const commentIcon = document.getElementById('comment-icon');
      const socialMediaMenu = document.getElementById('social-media-menu');
      let menuVisible = false;
  
      commentIcon.addEventListener('click', function() {
          if (menuVisible) {
              socialMediaMenu.style.bottom = 'calc(10% + 40px)';
              socialMediaMenu.style.opacity = '0';
              socialMediaMenu.style.pointerEvents = 'none';
          } else {
              socialMediaMenu.style.bottom = 'calc(-15% + 70px)';
              socialMediaMenu.style.opacity = '1';
              socialMediaMenu.style.pointerEvents = 'auto';
          }
          menuVisible = !menuVisible;
      });
  
      document.addEventListener('click', function(event) {
          if (!commentIcon.contains(event.target) && !socialMediaMenu.contains(event.target)) {
              socialMediaMenu.style.bottom = 'calc(50% + 40px)';
              socialMediaMenu.style.opacity = '0';
              socialMediaMenu.style.pointerEvents = 'none';
              menuVisible = false;
          }
      });
  });
  
  
  
  
  
  
  function toggleAnswer(faqQuestion) {
      var answer = faqQuestion.querySelector('.faq-answer');
      if (answer.style.display === 'none') {
          answer.style.display = 'block';
      } else {
          answer.style.display = 'none';
      }
  }
  
  
  
  
  document.addEventListener("DOMContentLoaded", function () {
      const tickerText = document.getElementById("tickerText");
    
      // Map of category names to colors
      const categoryColors = {
        "Politics": "#2196F3",
        "Business": "#4CAF50",
        "Technology": "#f44336",
        "Sports": "#FF5722",
        "Entertainment": "#FF69B4",
        "Science": "#FF9800",
        "Health": "#9C27B0",
        "Education": "#009688",
        "Romance": "#E91E63",
        "Travel": "#3F51B5",
        "Fashion": "#673AB7"
      };
    
      async function fetchHeadlines() {
        try {
          const response = await fetch('https://infohub-ffez.onrender.com/api/posts/topHeadlines');
          const data = await response.json();
    
          // Clear previous content
          tickerText.innerHTML = '';
    
          const tickerSlider = document.createElement("div");
          tickerSlider.className = "ticker-slider";
    
          // Loop through categories and create ticker items
          data.forEach(categoryData => {
            const category = categoryData.category;
            const headlines = categoryData.headlines.slice(0, 5); // Limit to 5 headlines
    
            if (headlines.length > 0) {
              // Add category label once for each category
              const categoryLabel = document.createElement("span");
              categoryLabel.className = "category";
              categoryLabel.style.backgroundColor = categoryColors[category] || "#333";
              categoryLabel.textContent = category;
    
              tickerSlider.appendChild(categoryLabel);
    
              // Add each news item for the category
              headlines.forEach(headline => {
                const tickerItem = document.createElement("div");
                tickerItem.className = "ticker-item";
    
                // Add image
                const imageContainer = document.createElement("div");
                imageContainer.className = "ticker-image";
                const image = document.createElement("img");
                image.src = headline.image; // Image URL
                image.alt = headline.title; // Alt text
                imageContainer.appendChild(image);
    
                // Add title and link
                const titleContainer = document.createElement("div");
                titleContainer.className = "ticker-title";
                const link = document.createElement("a");
                link.href = `/post?slug=${headline.slug}`;
                link.textContent = headline.title;
                titleContainer.appendChild(link);
    
                // Append image and title to ticker item
                tickerItem.appendChild(imageContainer);
                tickerItem.appendChild(titleContainer);
    
                // Append ticker item to slider
                tickerSlider.appendChild(tickerItem);
              });
            }
          });
    
          // Append slider to ticker text container
          tickerText.appendChild(tickerSlider);
    
          // Initialize ticker animation with pause functionality
          initTicker();
        } catch (error) {
          console.error("Failed to fetch headlines:", error);
        }
      }
    
      function initTicker() {
        const tickerSlider = document.querySelector(".ticker-slider");
        let isPaused = false;
    
        // Add dragging capability
        let isDragging = false;
        let startX;
        let scrollLeft;
    
        tickerSlider.addEventListener("mousedown", (e) => {
          isDragging = true;
          startX = e.pageX - tickerSlider.offsetLeft;
          scrollLeft = tickerSlider.scrollLeft;
        });
    
        tickerSlider.addEventListener("mouseleave", () => {
          isDragging = false;
        });
    
        tickerSlider.addEventListener("mouseup", () => {
          isDragging = false;
        });
    
        tickerSlider.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          e.preventDefault();
          const x = e.pageX - tickerSlider.offsetLeft;
          const walk = (x - startX) * 2; // Scroll speed
          tickerSlider.scrollLeft = scrollLeft - walk;
        });
    
        // Pause animation on hover
        tickerSlider.addEventListener("mouseover", () => {
          isPaused = true;
          tickerSlider.style.animationPlayState = "paused";
        });
    
        tickerSlider.addEventListener("mouseout", () => {
          isPaused = false;
          tickerSlider.style.animationPlayState = "running";
        });
    
        // For touch devices
        tickerSlider.addEventListener("touchstart", (e) => {
          isPaused = true;
          tickerSlider.style.animationPlayState = "paused";
        });
    
        tickerSlider.addEventListener("touchend", () => {
          isPaused = false;
          tickerSlider.style.animationPlayState = "running";
        });
      }
    
      // Fetch headlines initially and set an interval for every 24 hours
      fetchHeadlines();
      setInterval(fetchHeadlines, 24 * 60 * 60 * 1000); // 24 hours
    });
    
    
    document.addEventListener("DOMContentLoaded", function () {
      const tickerText = document.getElementById("smallTickerText");
    
      // Map of category names to colors
      const categoryColors = {
        "Politics": "#2196F3",
        "Business": "#4CAF50",
        "Technology": "#f44336",
        "Sports": "#FF5722",
        "Entertainment": "#FF69B4",
        "Science": "#FF9800",
        "Health": "#9C27B0",
        "Education": "#009688",
        "Romance": "#E91E63",
        "Travel": "#3F51B5",
        "Fashion": "#673AB7"
      };
    
      async function fetchSmallHeadlines() {
        try {
          const response = await fetch('https://infohub-ffez.onrender.com/api/posts/topHeadlines');
          const data = await response.json();
    
          // Clear previous content
          tickerText.innerHTML = '';
    
          const tickerSlider = document.createElement("div");
          tickerSlider.className = "ticker-slider";
    
          // Loop through categories and create ticker items
          data.forEach(categoryData => {
            const category = categoryData.category;
            const headlines = categoryData.headlines.slice(0, 5); // Limit to 5 headlines
    
            if (headlines.length > 0) {
              // Add category label once for each category
              const categoryLabel = document.createElement("span");
              categoryLabel.className = "category";
              categoryLabel.style.backgroundColor = categoryColors[category] || "#333";
              categoryLabel.textContent = category;
    
              tickerSlider.appendChild(categoryLabel);
    
              // Add each news item for the category
              headlines.forEach(headline => {
                const tickerItem = document.createElement("div");
                tickerItem.className = "ticker-item";
    
                // Add image
                const imageContainer = document.createElement("div");
                imageContainer.className = "ticker-image";
                const image = document.createElement("img");
                image.src = headline.image; // Image URL
                image.alt = headline.title; // Alt text
                imageContainer.appendChild(image);
    
                // Add title and link
                const titleContainer = document.createElement("div");
                titleContainer.className = "ticker-title";
                const link = document.createElement("a");
                link.href = `/post?slug=${headline.slug}`;
                link.textContent = headline.title;
                titleContainer.appendChild(link);
    
                // Append image and title to ticker item
                tickerItem.appendChild(imageContainer);
                tickerItem.appendChild(titleContainer);
    
                // Append ticker item to slider
                tickerSlider.appendChild(tickerItem);
              });
            }
          });
    
          // Append slider to ticker text container
          tickerText.appendChild(tickerSlider);
    
          // Initialize ticker animation with pause functionality
          initTicker();
        } catch (error) {
          console.error("Failed to fetch headlines:", error);
        }
      }
    
      function initTicker() {
        const tickerSlider = document.querySelector(".ticker-slider");
        let isPaused = false;
    
        // Add dragging capability
        let isDragging = false;
        let startX;
        let scrollLeft;
    
        tickerSlider.addEventListener("mousedown", (e) => {
          isDragging = true;
          startX = e.pageX - tickerSlider.offsetLeft;
          scrollLeft = tickerSlider.scrollLeft;
        });
    
        tickerSlider.addEventListener("mouseleave", () => {
          isDragging = false;
        });
    
        tickerSlider.addEventListener("mouseup", () => {
          isDragging = false;
        });
    
        tickerSlider.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          e.preventDefault();
          const x = e.pageX - tickerSlider.offsetLeft;
          const walk = (x - startX) * 2; // Scroll speed
          tickerSlider.scrollLeft = scrollLeft - walk;
        });
    
        // Pause animation on hover
        tickerSlider.addEventListener("mouseover", () => {
          isPaused = true;
          tickerSlider.style.animationPlayState = "paused";
        });
    
        tickerSlider.addEventListener("mouseout", () => {
          isPaused = false;
          tickerSlider.style.animationPlayState = "running";
        });
    
        // For touch devices
        tickerSlider.addEventListener("touchstart", (e) => {
          isPaused = true;
          tickerSlider.style.animationPlayState = "paused";
        });
    
        tickerSlider.addEventListener("touchend", () => {
          isPaused = false;
          tickerSlider.style.animationPlayState = "running";
        });
      }
    
      // Fetch headlines initially and set an interval for every 24 hours
      fetchSmallHeadlines();
      setInterval(fetchSmallHeadlines, 24 * 60 * 60 * 1000); // 24 hours
    });



    document.addEventListener("DOMContentLoaded", async () => {
      const spinner = document.getElementById("spinner");
      const menuMegaContent = document.querySelector(".menu-mega-content-label");
    
      if (!spinner || !menuMegaContent) {
        console.error("Required elements are missing in the DOM.");
        showNotificationBottomRight("Required elements are missing in the DOM.", 'error');
        return;
      }
    
      menuMegaContent.innerHTML = ""; // Clear any existing content
    
      // Show the spinner immediately
      spinner.style.display = "block";
    
      try {
        const response = await fetch("https://infohub-ffez.onrender.com/api/posts/trending");
        const trendingPosts = await response.json();
    
        // Log the fetched posts to the console
        console.log("Fetched Trending Posts:", trendingPosts);
    
        if (trendingPosts.length === 0) {
          menuMegaContent.innerHTML = "<p>No trending posts available.</p>";
          showNotificationCenter('No trendind posts available.', 'info')
        } else {
          trendingPosts.forEach((post, index) => {
            const imageUrl = post.image
              ? `https://infohub-ffez.onrender.com${post.image}`
              : "default-image-path.jpg"; // Fallback image if none is provided
    
            const itemHTML = `
                <div class="item item-${index}">
                  <a href="/api/posts/post/${post.slug}" class="item-thumbnail optimized">
                    <img loading="lazy" decoding="async" src="${imageUrl}" alt="${post.title}">
                    <i class="fa-solid fa-camera"></i>
                  </a>
                  <a href="/api/posts/post/${post.slug}" class="item-title">${post.title.slice(0, 60)}...<span style="color: #FF69B4; font-size: 0.65rem; font-style: italic;">Read</span></a>
                  <div class="clear"></div>
                </div>
              `;
    
            menuMegaContent.insertAdjacentHTML("beforeend", itemHTML);
          });
        }
      } catch (error) {
        console.error("Error fetching trending posts:", error);
        menuMegaContent.innerHTML = "<p>Failed to load trending posts. Please try again later.</p>";
        showNotificationBottomRight("Failed to load trending posts. Please try again later.", 'error');
      } finally {
        // Hide the spinner
        spinner.style.display = "none";
      }
    });
    
    
    document.addEventListener("DOMContentLoaded", async () => {
      const spinner = document.getElementById("spinner");
      const menuMegaContent = document.querySelector(".small-menu-mega-content-label");
    
      if (!spinner || !menuMegaContent) {
        console.error("Required elements are missing in the DOM.");
        return;
      }
    
      menuMegaContent.innerHTML = ""; // Clear any existing content
    
      // Show the spinner immediately
      spinner.style.display = "block";
    
      try {
        const response = await fetch("https://infohub-ffez.onrender.com/api/posts/trending");
        const trendingPosts = await response.json();
    
        // Log the fetched posts to the console
        console.log("Fetched Trending Posts:", trendingPosts);
    
        if (trendingPosts.length === 0) {
          menuMegaContent.innerHTML = "<p>No trending posts available.</p>";
        } else {
          trendingPosts.forEach((post, index) => {
            const imageUrl = post.image
              ? `https://infohub-ffez.onrender.com${post.image}`
              : "default-image-path.jpg"; // Fallback image if none is provided
    
            const itemHTML = `
              <div class="item item-${index}">
                <a href="/api/posts/post/${post.slug}" class="item-thumbnail optimized">
                  <img loading="lazy" decoding="async" src="${imageUrl}" alt="${post.title}">
                  <i class="fa-solid fa-camera"></i>
                </a>
                <a href="/api/posts/post/${post.slug}" class="item-title">${post.title.slice(0, 60)}...<span style="color: #FF69B4; font-size: 0.65rem; font-style: italic;">Read</span></a>
                <div class="clear"></div>
              </div>
            `;
    
            menuMegaContent.insertAdjacentHTML("beforeend", itemHTML);
          });
        }
      } catch (error) {
        console.error("Error fetching trending posts:", error);
        menuMegaContent.innerHTML = "<p>Failed to load trending posts. Please try again later.</p>";
      } finally {
        // Hide the spinner
        spinner.style.display = "none";
      }
    });
  
  
  document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.getElementById("searchInput");
      const resultsContainer = document.getElementById("searchResults");
    
      async function searchPosts() {
        const searchTerm = searchInput.value.trim();
        console.log("Search Term:", searchTerm);
        if (!searchTerm) {
          resultsContainer.style.display = 'none';
          return;
        }
    
        let searchTimeout;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
          try {
            const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/search?term=${encodeURIComponent(searchTerm)}`);
            const posts = await response.json();
    
            displayPosts(posts, searchTerm); // Pass search term for highlighting
          } catch (error) {
            console.error("Error searching posts:", error);
          }
        }, 300); // 300ms debounce
      }
    
      function highlightKeyword(text, keyword) {
        if (typeof text !== 'string') return ''; // Ensure text is a string
        const regex = new RegExp(`(${keyword})`, "gi");
        return text.replace(regex, "<span class='highlight'>$1</span>");
      }
    
      function displayPosts(posts, searchTerm) {
        console.log("Posts Received:", posts);
        resultsContainer.innerHTML = ''; // Clear previous results
        resultsContainer.style.display = 'block'; // Show the results container
    
        if (!posts || posts.length === 0) {
          resultsContainer.innerHTML = '<p class="noResults">No results found</p>';
          return;
        }
    
        posts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.classList.add('post-item');
    
          const imageUrl = post.image ? `https://infohub-ffez.onrender.com${post.image}` : 'default-image-path.jpg';
    
          postElement.innerHTML = `
            <div class="post-item-image">
              <img src="${imageUrl}" alt="${post.title}" />
            </div>
            <div class="post-item-content">
              <a href="/api/posts/post/${post.slug}">${highlightKeyword(post.title, searchTerm)}</a>
              <p>${post.content ? highlightKeyword(post.content.substring(0, 100), searchTerm) : ''}...</p>
              <span>${post.categories || ''} | ${(post.tags && post.tags.join(', ')) || ''}</span>
              <span> | By: ${post.author || ''} | ${timeAgo(new Date(post.createdAt))}</span>
            </div>
          `;
    
          resultsContainer.appendChild(postElement);
        });
      }
    
      // Hide search results on click outside
      document.addEventListener("click", (event) => {
        if (!resultsContainer.contains(event.target) && !searchInput.contains(event.target)) {
          resultsContainer.style.display = 'none';
        }
      });
    
      // Trigger searchPosts on keyup inside the search input
      searchInput.addEventListener('keyup', searchPosts);
    });
  
  
  document.getElementById("subscribe-newsletter").addEventListener("click", function () {
    document.getElementById("newsletter-overlay").style.display = "flex";
  });
  
  document.getElementById("subscribe-updates").addEventListener("click", function () {
    document.getElementById("updates-overlay").style.display = "flex";
  });
  document.getElementById("small-newsletterModal").addEventListener("click", function () {
    document.getElementById("newsletter-overlay").style.display = "flex";
    document.getElementById("menu-section").style.display = "none";
  });
  document.getElementById("footer-newsletterModal").addEventListener("click", function () {
    document.getElementById("newsletter-overlay").style.display = "flex";
  });
  
  document.getElementById("small-updatesModal").addEventListener("click", function () {
    document.getElementById("updates-overlay").style.display = "flex";
    document.getElementById("menu-section").style.display = "none";
  });
  document.getElementById("footer-updatesModal").addEventListener("click", function () {
    document.getElementById("updates-overlay").style.display = "flex";
  });
  
  document.getElementById("close-newsletter-form").addEventListener("click", function () {
    document.getElementById("newsletter-overlay").style.display = "none";
    restoreMenuButtonState();
  });
  
  document.getElementById("close-updates-form").addEventListener("click", function () {
    document.getElementById("updates-overlay").style.display = "none";
    restoreMenuButtonState();
  });
  
  window.onclick = function (event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
  
  
  // Toggle menu open/close
  document.getElementById("dropdown-toggle").onclick = function () {
    const menuSection = document.getElementById("menu-section");
    if (menuSection.style.display === "block") {
        menuSection.style.display = "none"; // Close the menu
        restoreMenuButtonState();
    } else {
        menuSection.style.display = "block"; // Open the menu
    }
  };
  
  // Close menu if clicking outside of it
  window.onclick = function (event) {
    const menuSection = document.getElementById("menu-section");
    const menuToggleButton = document.getElementById("dropdown-toggle");
    if (menuSection.style.display === "block" && 
        !menuSection.contains(event.target) &&
        event.target !== menuToggleButton) {
        menuSection.style.display = "none";
        restoreMenuButtonState(); 
    }
  };
  
  // Restore menu button state after closing modals
  function restoreMenuButtonState() {
    const menuSection = document.getElementById("menu-section");
    const menuToggleButton = document.getElementById("dropdown-toggle");
    // If menu toggle button is still valid, restore its functionality
    if (menuSection.style.display === "block") {
        menuToggleButton.click();
    }
  }
  
  
  const subscribeToType = (formId, emailInputId, usernameInputId, messageId, type, overlayId) => {
    document.getElementById(formId).addEventListener("submit", function (event) {
      event.preventDefault();
  
      const emailInput = document.getElementById(emailInputId);
      const usernameInput = document.getElementById(usernameInputId);
      const email = emailInput.value;
      const username = usernameInput.value.trim();
      const messageElement = document.getElementById(messageId);
      const overlay = document.getElementById(overlayId);
  
      // Get selected niches
      const selectedNiches = Array.from(
        document.querySelectorAll(`#${formId} input[type="checkbox"]:checked`)
      ).map((checkbox) => checkbox.value);
  
      // Validate based on subscription type
      if (type === "Newsletter") {
        if (!username || !email || selectedNiches.length === 0) {
          showNotificationCenter("Please enter a valid username, email, and select at least one interest.", 'warning');
          // messageElement.textContent = "Please enter a valid username, email, and select at least one interest.";
          // messageElement.classList.remove("success");
          // messageElement.classList.add("error");
          setTimeout(() => (messageElement.textContent = ""), 3000);
          return;
        }
      } else {
        if (!email || !username) {
          showNotificationCenter("Please enter a valid email and username.", 'warning');
          // messageElement.classList.remove("success");
          // messageElement.classList.add("error");
          setTimeout(() => (messageElement.textContent = ""), 3000);
          return;
        }
      }
  
      if (!/^[a-zA-Z0-9\s]+$/.test(username)) {
        showNotificationCenter("Invalid username format. Please use only spaces, letters and numbers.", 'error');
        // messageElement.textContent = "Invalid username format. Please use only spaces, letters and numbers.";
        // messageElement.classList.remove("success");
        // messageElement.classList.add("error");
        setTimeout(() => (messageElement.textContent = ""), 3000);
        return;
      }
  
  
      // API call to subscribe
      fetch("https://infohub-ffez.onrender.com/api/newsLetter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, type, niches: selectedNiches }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showNotificationCenter(`Thank you, ${username}, for subscribing to ${type}!`, 'success');
            // messageElement.textContent = `Thank you, ${username}, for subscribing to ${type}!`;
            // messageElement.classList.remove("error");
            // messageElement.classList.add("success");
  
            // Clear the form and close the overlay after success
            setTimeout(() => {
              messageElement.textContent = "";
              emailInput.value = "";
              usernameInput.value = ""; // Clear username
              overlay.style.display = "none"; // Close container
            }, 3000);
          } else {
            showNotificationCenter(data.message || "Something went wrong. Please try again.", 'error');
            // messageElement.textContent = data.message || "Something went wrong. Please try again.";
            // messageElement.classList.remove("success");
            // messageElement.classList.add("error");
            setTimeout(() => (messageElement.textContent = ""), 3000);
          }
        })
        .catch(() => {
          showNotificationCenter("Something went wrong. Please try again.", 'error');
          messageElement.classList.remove("success");
          messageElement.classList.add("error");
          setTimeout(() => (messageElement.textContent = ""), 3000);
        });
    });
  };
  
  // Updated event listeners for forms
  subscribeToType("newsletter-form", "newsletter-email", "newsletter-username", "newsletter-message", "Newsletter", "newsletter-overlay");
  subscribeToType("updates-form", "updates-email", "updates-username", "updates-message", "Updates", "updates-overlay");


  document.addEventListener('DOMContentLoaded', () => {
    const placeholders = {
        1: document.querySelector('.first-ad'),
        2: document.querySelector('.second-ad'),
        3: document.querySelector('.five-star-container'),
    };
  
    // Predefined CTA buttons
    const ctaButtons = ["Call Now", "Visit", "Buy Now", "Click Link", "Learn More"];
  
    async function fetchAds() {
        try {
            const response = await fetch('https://infohub-ffez.onrender.com/api/ads/get');
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
                    container.innerHTML = '<p>Advertise Your Brand Here</p>';
                }
                return;
            }
  
            const ad = ads[index];
            const randomCTA = ctaButtons[Math.floor(Math.random() * ctaButtons.length)];
            container.innerHTML = `
                <a href="${ad.targetUrl}" target="_blank">
                    <img loading="lazy" decoding="async" src="${ad.imageUrl}" alt="Ad Banner" title="Click to visit - ${ad.targetUrl} for more inquiries">
                </a>
                <div class="ad-description">
                    <a href="${ad.targetUrl}">${ad.targetUrl}</a>
                    <p>${ad.description || "Discover what we have to offer!"}</p>
                    <button onclick="window.open('${ad.targetUrl}', '_blank')">${randomCTA}</button>
                </div>
            `;
            index = (index + 1) % ads.length;
            setTimeout(rotateAds, 30000); // Rotate every 30 seconds
        }
  
        rotateAds();
    }
  
    fetchAds();
  });

  fetchUserProfile