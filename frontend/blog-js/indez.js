
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


// // authorDetails.js
// document.addEventListener('DOMContentLoaded', async () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const username = urlParams.get('username');

//   if (!username) return;

//   try {
//     const token = localStorage.getItem('accessToken');
//     const response = await fetch(`https://infohub-ffez.onrender.com/api/user/author/${username}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!response.ok) throw new Error('Failed to load author details');

//     const { authorDetails, articleCount, categories, posts, currentPage, totalPages } = await response.json();

//     // Populate author and category details
//     populateAuthorDetails({ ...authorDetails, categories, articleCount });

//     // Initial articles and set up pagination
//     populateAuthorArticles(posts);
//     setupPagination(username, currentPage, totalPages); // Pass currentPage and totalPages
//   } catch (error) {
//     console.error('Error loading author details:', error);
//     showNotificationBottomRight(error.message, 'error');
//   }
// });


// function populateAuthorDetails(author) {
//   // Basic details
//   document.getElementById('author-image-avatar').src = author.avatar;
//   document.getElementById('author-username').textContent = author.username;
//   document.getElementById('author-bio').textContent = author.bio || 'No bio available';
//   document.getElementById('author-education').textContent = author.education || 'N/A';
//   document.getElementById('author-experience').textContent = author.workExperience || 'N/A';
//   document.getElementById('author-awards').textContent = author.awards || 'N/A';
//   document.getElementById('article-count').textContent = author.articleCount || 0;
//   document.getElementById('author-reg-date').textContent = new Date(author.createdAt).toLocaleDateString();
//   document.getElementById('author-name').textContent = author.username;
//   document.title = `${author.username}, Profile and All Articles on Crowntips_Info_Hub`;


//   // Social media links
//   const socialHandles = author.socialMediaHandles || {};

//   const socialLinksData = {
//     facebook: { icon: 'fab fa-facebook', color: '#1877F2' },
//     twitter: { icon: 'fab fa-twitter', color: '#1DA1F2' },
//     instagram: { icon: 'fab fa-instagram', color: '#E4405F' },
//     linkedin: { icon: 'fab fa-linkedin', color: '#0A66C2' },
//   };

//   const socialLinksContainer = document.querySelector('.author-social-handles');
//   socialLinksContainer.innerHTML = ''; // Clear any existing content

//   Object.keys(socialLinksData).forEach(platform => {
//     if (socialHandles[platform]) {
//       const li = document.createElement('li');
//       const a = document.createElement('a');
//       a.href = socialHandles[platform];
//       a.target = '_blank';
//       a.style.color = socialLinksData[platform].color; 
//       a.innerHTML = `<i class="${socialLinksData[platform].icon}"></i>`;
//       li.appendChild(a);
//       socialLinksContainer.appendChild(li);
//     }
//   });

//   // Populate categories
//   const categoriesList = document.getElementById('author-categories');
//   categoriesList.innerHTML = ''; // Clear existing content
//   author.categories.forEach(category => {
//     const li = document.createElement('li');
//     li.textContent = `${category._id} (${category.count})`;
//     li.title = `${category._id} Category, Articles: ${category.count}`; // Add title attribute
//     categoriesList.appendChild(li);
//   });
// }

// function populateAuthorArticles(posts) {
//   const articlesContainer = document.getElementById('author-articles');
//   articlesContainer.innerHTML = ''; // Clear existing content
//   posts.forEach(post => {
//     const articleDiv = document.createElement('div');
//     articleDiv.className = 'article-card';
//     articleDiv.innerHTML = `
//     <div class="tech-article-headline topic">
//           <img src="${post.image || 'images/default-image.jpg'}" alt="${post.title}">
//           <div class="tech-headline-info">
//             <h2><a href="#">${post.categories}</a></h2>
//             <p><a href="/post/${post.slug}">${post.title}</a></p>
//           </div>
//         </div>
//         <div class="headline-brief">
//           <p>${post.content.slice(0, 80)}...<span class="readmore-link"><a href="/post/${post.slug}">Read</a></span></p>
//           <hr class="section-divider">
//           <div class="icon">
//             <a href="#"><span><i class="fas fa-clock icon"></i>${formatPostDate(new Date(post.createdAt))}</span></a>
//           </div>
//         </div>
//     `;
//     articlesContainer.appendChild(articleDiv);
//   });
// }

// function setupPagination(username, currentPage, totalPages) {
//   const loadMoreButton = document.getElementById('load-more-articles');
//   if (currentPage >= totalPages) {
//     loadMoreButton.style.display = 'none';
//     return;
//   }

//   loadMoreButton.addEventListener('click', async () => {
//     try {
//       const nextPage = currentPage + 1; // Increment the current page
//       const response = await fetch(`https://infohub-ffez.onrender.com/api/user/author/${username}?page=${nextPage}&limit=6`);
//       const { posts, currentPage: newCurrentPage, totalPages: newTotalPages } = await response.json();

//       populateAuthorArticles(posts); // Load more articles
//       setupPagination(username, newCurrentPage, newTotalPages); // Update pagination state
//     } catch (error) {
//       console.error('Error loading more articles:', error);
//     }
//   });
// }


document.addEventListener('DOMContentLoaded', () => {
  const socialList = document.getElementById('social-list');
  const totalFollowers = document.querySelector('.social-container-header h2');
  const overlay = document.getElementById('social-confirmation-overlay');
  const platformName = document.getElementById('platform-name');
  const confirmYes = document.getElementById('confirm-yes');
  const confirmNo = document.getElementById('confirm-no');

  const platforms = {
    facebook: { class: 'facebook-likes', color: '#3b5998', icon: 'fa-facebook-f', metric: 'Followers' },
    twitter: { class: 'twitter', color: '#1da1f2', icon: 'fa-twitter', metric: 'Likes' },
    instagram: { class: 'instagram', color: '#e4405f', icon: 'fa-instagram', metric: 'Likes' },
    linkedin: { class: 'linkedin', color: '#0077b5', icon: 'fa-linkedin-in', metric: 'Followers' },
    youtube: { class: 'youtube', color: '#ff0000', icon: 'fa-youtube', metric: 'Subscribers' },
    pinterest: { class: 'pinterest', color: '#bd081c', icon: 'fa-pinterest', metric: 'Followers' },
  };

  const socialLinks = {
    facebook: 'https://www.facebook.com/yourPageHandle',
    twitter: 'https://twitter.com/yourProfileHandle',
    instagram: 'https://www.instagram.com/yourProfileHandle',
    linkedin: 'https://www.linkedin.com/in/yourProfileHandle',
    youtube: 'https://www.youtube.com/c/yourChannelHandle',
    pinterest: 'https://www.pinterest.com/yourProfileHandle',
  };

  let currentUrl = '';

  // Fetch metrics from backend
  const fetchMetrics = async () => {
    try {
      const response = await fetch('https://infohub-ffez.onrender.com/api/social/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');

      const metricsArray = await response.json();
      const metrics = metricsArray.reduce((acc, item) => {
        acc[item.platform] = item.count;
        return acc;
      }, {});

      socialList.innerHTML = '';
      let total = 0;

      Object.entries(platforms).forEach(([platform, platformData]) => {
        const count = metrics[platform] || 0;
        total += count;

        const listItem = `
          <li class="social-item ${platformData.class}">
            <a href="${socialLinks[platform]}" target="_blank" class="social-link" data-platform="${platform}" data-url="${socialLinks[platform]}">
              <span class="social-text">
                <i style="padding: 4px 6px; border-radius: 5px; background-color: ${platformData.color}; color: #ffffff;" 
                   class="fab ${platformData.icon}"></i>
                ${count} ${platformData.metric}
              </span>
              <button class="social-button ${platformData.class}">
                ${platformData.metric === 'Followers' ? 'Follow' :
            platformData.metric === 'Subscribers' ? 'Subscribe' : 'Like'}
                <span class="icon">
                  <i class="fas ${platformData.metric === 'Followers' ? 'fa-user-plus' :
            platformData.metric === 'Subscribers' ? 'fa-bell' : 'fa-thumbs-up'}" 
                    style="color: #ffffff;">
                  </i>
                </span>
              </button>
            </a>
          </li>
        `;
        socialList.insertAdjacentHTML('beforeend', listItem);
      });

      totalFollowers.innerText = `${total}+ Social Counters`;

      // Attach click events to social links
      document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          currentUrl = link.getAttribute('data-url');
          const platform = link.getAttribute('data-platform');
          platformName.innerText = platform.charAt(0).toUpperCase() + platform.slice(1);
          overlay.classList.remove('social-hidden');
        });
      });

      confirmYes.addEventListener('click', () => {
        window.open(currentUrl, '_blank');
        overlay.classList.add('social-hidden');
      });

      confirmNo.addEventListener('click', () => {
        overlay.classList.add('social-hidden');
      });

    } catch (error) {
      console.error('Error fetching social metrics:', error);
    }
  };

  fetchMetrics();
});



document.addEventListener('DOMContentLoaded', function () {
  const fetchPostsByCategory = async (type, category) => {
    try {
      const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/local-world/${type}?category=${category}`);
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Function to render posts for a specific category
  const renderCategoryPosts = (categoryId, posts) => {
    const categoryList = document.getElementById(categoryId);

    if (!categoryList) {
      console.error(`Element with ID ${categoryId} not found`);
      return;
    }

    categoryList.innerHTML = ''; // Clear previous posts

    if (posts.length === 0) {
      // Show spinner and "Coming soon" message if no posts are available
      categoryList.innerHTML = `
        <div style="background: none; margin-top: 20px;" class="container-skeleton-loaders small">
          <div class="container-spinners"></div>
        </div>
        <h3 style="font-size: 0.8rem;
                                                margin: 5px 0;
                                                font-weight: 300;
                                                text-align: center;">Coming soon</h3>
      `;
      return;
    }

    // Render top 4 recent posts
    posts.slice(0, 4).forEach(post => {
      const postItem = document.createElement('li');
      postItem.classList.add('menu-item-type-post', 'menu-items');
      postItem.innerHTML = `
        <a href="/api/posts/post/${post.slug}">
          <img src="${post.image}" alt="${post.title}" style="width: 50px; height: 50px;">
          <h4>${post.title.length > 30 ? post.title.slice(0, 30) + '...' : post.title}<span style="font-size:11px; color:#ff69b4; font-style: italic;">Read</span></h4>
        </a>
      `;
      categoryList.appendChild(postItem);
    });
  };

  const renderLocalNewsPosts = async () => {
    const categories = ['Business', 'Politics', 'Entertainment', 'Education'];

    for (const category of categories) {
      const posts = await fetchPostsByCategory('Local', category);
      renderCategoryPosts(`${category.toLowerCase()}-posts`, posts);
    }
  };

  // Initial rendering of Local News
  renderLocalNewsPosts();

  const localNewsMenu = document.querySelector('.local-news-menu');

  if (localNewsMenu) {
    localNewsMenu.addEventListener('mouseenter', () => {
      console.log('Local News hovered');
      renderLocalNewsPosts();
    });
  }

});
document.addEventListener('DOMContentLoaded', function () {
  const fetchSmallPostsByCategory = async (type, category) => {
    try {
      const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/local-world/${type}?category=${category}`);
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Function to render posts for a specific category
  const renderSmallCategoryPosts = (categoryId, posts) => {
    const smallCategoryList = document.getElementById(categoryId);

    if (!smallCategoryList) {
      console.error(`Element with ID ${categoryId} not found`);
      return;
    }

    smallCategoryList.innerHTML = ''; // Clear previous posts

    if (posts.length === 0) {
      // Show spinner and "Coming soon" message if no posts are available
      smallCategoryList.innerHTML = `
        <div style="background: none; margin-top: 20px;" class="container-skeleton-loaders small">
          <div class="container-spinners"></div>
        </div>
        <h3 style="font-size: 0.8rem;
                                                margin: 5px 0;
                                                font-weight: 300;
                                                text-align: center;">Coming soon</h3>
      `;
      return;
    }

    // Render top 4 recent posts
    posts.slice(0, 4).forEach(post => {
      const smallPostItem = document.createElement('li');
      smallPostItem.classList.add('menu-item-type-post', 'menu-items');
      smallPostItem.innerHTML = `
        <a class="small-menu-item-a" href="/api/posts/post/${post.slug}">
          <img src="${post.image}" alt="${post.title}" style="width: 50px; height: 50px;">
          <h4>${post.title.length > 30 ? post.title.slice(0, 30) + '...' : post.title}<span style="font-size:11px; color:#ff69b4; font-style: italic;">Read</span></h4>
        </a>
      `;
      smallCategoryList.appendChild(smallPostItem);
    });
  };

  const renderSmallLocalNewsPosts = async () => {
    const smallCategories = ['Business', 'Politics', 'Entertainment', 'Education'];

    for (const category of smallCategories) {
      const posts = await fetchSmallPostsByCategory('Local', category);
      renderSmallCategoryPosts(`small-local-${category.toLowerCase()}-posts`, posts);
    }
  };

  // Initial rendering of Local News
  renderSmallLocalNewsPosts();

  const localNewsMenu = document.querySelector('.local-news-menu');

  if (localNewsMenu) {
    localNewsMenu.addEventListener('mouseenter', () => {
      console.log('Local News hovered');
      renderSmallLocalNewsPosts();
    });
  }

});
document.addEventListener('DOMContentLoaded', function () {
  // Function to fetch posts based on category type (Local or World)
  const fetchPostsByCategory = async (type, category) => {
    try {
      const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/local-world/${type}?category=${category}`);
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Function to render posts for a specific category
  const renderCategoryPosts = (categoryId, posts) => {
    const categoryList = document.getElementById(categoryId);

    if (!categoryList) {
      console.error(`Element with ID ${categoryId} not found`);
      return;
    }

    categoryList.innerHTML = ''; // Clear previous posts

    if (posts.length === 0) {
      // Show spinner and "Coming soon" message if no posts are available
      categoryList.innerHTML = `
        <div style="background: none; margin-top: 20px;" class="container-skeleton-loaders small">
          <div class="container-spinners"></div>
        </div>
        <h3 style="font-size: 0.8rem;
                                                margin: 5px 0;
                                                font-weight: 300;
                                                text-align: center;">Coming soon</h3>
      `;
      return;
    }

    // Render top 4 recent posts
    posts.slice(0, 4).forEach(post => {
      const postItem = document.createElement('li');
      postItem.classList.add('menu-item-type-post', 'menu-items');
      postItem.innerHTML = `
        <a href="/api/posts/post/${post.slug}">
          <img src="${post.image}" alt="${post.title}" style="width: 50px; height: 50px;">
          <h4>${post.title.length > 30 ? post.title.slice(0, 30) + '...' : post.title}<span style="font-size:11px; color:#ff69b4; font-style: italic;">Read</span></h4>
        </a>
      `;
      categoryList.appendChild(postItem);
    });
  };

  const renderWorldNewsPosts = async () => {
    console.log('renderWorldNewsPosts called');
    const categories = ['Travel', 'Sports', 'Health', 'Technology'];

    for (const category of categories) {
      const posts = await fetchPostsByCategory('World', category);
      console.log(`Fetched World posts for category: ${category}`, posts);
      renderCategoryPosts(`${category.toLowerCase()}-posts`, posts);
    }
  };

  // Initial rendering of World News
  renderWorldNewsPosts();

  const worldNewsMenu = document.querySelector('.world-news-menu');

  if (worldNewsMenu) {
    worldNewsMenu.addEventListener('mouseenter', () => {
      console.log('World News hovered');
      renderWorldNewsPosts();
    });
  }

});
document.addEventListener('DOMContentLoaded', function () {
  // Function to fetch posts based on category type (Local or World)
  const fetchSmallPostsByCategory = async (type, category) => {
    try {
      const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/local-world/${type}?category=${category}`);
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Function to render posts for a specific category
  const renderSmallCategoryPosts = (categoryId, posts) => {
    const smallCategoryList = document.getElementById(categoryId);

    if (!smallCategoryList) {
      console.error(`Element with ID ${categoryId} not found`);
      return;
    }

    smallCategoryList.innerHTML = ''; // Clear previous posts

    if (posts.length === 0) {
      // Show spinner and "Coming soon" message if no posts are available
      smallCategoryList.innerHTML = `
        <div style="background: none; margin-top: 20px;" class="container-skeleton-loaders small">
          <div class="container-spinners"></div>
        </div>
        <h3 style="font-size: 0.8rem;
                                                margin: 5px 0;
                                                font-weight: 300;
                                                text-align: center;">Coming soon</h3>
      `;
      return;
    }

    // Render top 4 recent posts
    posts.slice(0, 4).forEach(post => {
      const smallPostItem = document.createElement('li');
      smallPostItem.classList.add('menu-item-type-post', 'menu-items');
      smallPostItem.innerHTML = `
        <a class="small-menu-item-a" href="/api/posts/post/${post.slug}">
          <img src="${post.image}" alt="${post.title}" style="width: 50px; height: 50px;">
          <h4>${post.title.length > 30 ? post.title.slice(0, 30) + '...' : post.title}<span style="font-size:11px; color:#ff69b4; font-style: italic;">Read</span></h4>
        </a>
      `;
      smallCategoryList.appendChild(smallPostItem);
    });
  };

  const renderSmallWorldNewsPosts = async () => {
    console.log('renderWorldNewsPosts called');
    const smallCategories = ['Travel', 'Sports', 'Health', 'Technology'];

    for (const category of smallCategories) {
      const posts = await fetchSmallPostsByCategory('World', category);
      console.log(`Fetched World posts for category: ${category}`, posts);
      renderSmallCategoryPosts(`small-world-${category.toLowerCase()}-posts`, posts);
    }
  };

  // Initial rendering of World News
  renderSmallWorldNewsPosts();

  const worldNewsMenu = document.querySelector('.world-news-menu');

  if (worldNewsMenu) {
    worldNewsMenu.addEventListener('mouseenter', () => {
      console.log('World News hovered');
      renderSmallWorldNewsPosts();
    });
  }

});





// document.addEventListener('DOMContentLoaded', () => {
//   const quotesSlider = document.getElementById('quotes-slider');

//   // Fetch daily quotes from the backend
//   fetch('https://infohub-ffez.onrender.com/api/quote/daily-quotes', {
//     method: 'GET',
//     headers: {
//       'Authorization': 'Bearer Ii0eYLCC8ADMxUjBizxqil9vGwPgBORX8jhIDWIB0f6d9b55',  
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(response => response.json())
//     .then(quotes => {
//       quotes.forEach((quote, index) => {
//         // Generate a quote slide
//         const slide = document.createElement('div');
//         slide.classList.add('quote-slide');

//         // Set a default background or use a dynamic one
//         slide.style.backgroundImage = `url('images/steve-jobs-invert.webp')`;

//         // Populate the slide with quote data
//         slide.innerHTML = `
//                   <p>"${quote.content}" <br><small>- ${quote.author}</small></p>
//                   <img src="images/mycvpassport.png" alt="Author ${index + 1}" class="author-img">
//               `;

//         quotesSlider.appendChild(slide);
//       });

//       initSlider(); // Initialize slider once quotes are loaded
//     })
//     .catch(error => console.error('Error fetching quotes:', error));
// });

// // Basic Slider Logic
// function initSlider() {
//   let currentIndex = 0;
//   const slides = document.querySelectorAll('.quote-slide');
//   const totalSlides = slides.length;

//   function showSlide(index) {
//     slides.forEach((slide, i) => {
//       slide.style.display = i === index ? 'block' : 'none';
//     });
//   }

//   function nextSlide() {
//     currentIndex = (currentIndex + 1) % totalSlides;
//     showSlide(currentIndex);
//   }

//   // Show the first slide and set an interval for auto-slide
//   showSlide(currentIndex);
//   setInterval(nextSlide, 5000); // Change slide every 5 seconds
// }


document.getElementById('FeedbackForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const messageElement = document.getElementById('response');
  messageElement.textContent = '';

  const formData = new FormData(this);
  const feedbackData = {};
  formData.forEach((value, key) => {
    feedbackData[key] = value;
  });

  fetch('https://infohub-ffez.onrender.com/api/contact/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(feedbackData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        showNotificationTopRight('Hello,', data.message); // Thank you message
        this.reset();
      } else if (data.error) {
        showNotificationBottomRight('Hello,', data.error);
        this.reset();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      messageElement.textContent = ('An error occurred while submitting your feedback. Please try again.', 'error');
      this.reset();
    });
});




// Handle avatar updates for Readers (Gallery Selection)
document.querySelectorAll('.avatar-option').forEach(option => {
  option.addEventListener('click', async (e) => {
    const selectedAvatar = e.target.src;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://infohub-ffez.onrender.com/api/user/update-avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: selectedAvatar }),
      });

      if (response.ok) {
        showNotificationTopRight('Avatar updated successfully!', 'success');
        const userData = await response.json();
        console.log('User Data:', userData)

        // Update Reader's avatar in the UI
        document.getElementById('reader-current-avatar').src =
          userData.avatar || './images/ImgUnavailable.jpeg';
        fetchUserProfile();

      } else {
        showNotificationBottomRight('Failed to update avatar.', 'error');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      showNotificationBottomRight('An error occurred while updating the avatar.', 'error');
    }

    document.getElementById('avatar-gallery').classList.add('avatar-gallery-hidden');
  });
});

document.getElementById('edit-avatar-btn').addEventListener('click', () => {
  const gallery = document.getElementById('avatar-gallery');
  gallery.classList.toggle('avatar-gallery-hidden');
});


document.querySelectorAll('.small-avatar-option').forEach(option => {
  option.addEventListener('click', async (e) => {
    const selectedAvatar = e.target.src;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://infohub-ffez.onrender.com/api/user/update-avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: selectedAvatar }),
      });

      if (response.ok) {
        showNotificationTopRight('Avatar updated successfully!', 'success');
        const userData = await response.json();
        console.log('User Data:', userData)

        // Update Reader's avatar in the UI
        document.getElementById('small-reader-current-avatar').src =
          userData.avatar || './images/ImgUnavailable.jpeg';
        fetchSmallUserProfile();

      } else {
        showNotificationBottomRight('Failed to update avatar.', 'error');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      showNotificationBottomRight('An error occurred while updating the avatar.', 'error');
    }

    document.getElementById('small-avatar-gallery').classList.add('avatar-gallery-hidden');
  });
});


document.getElementById('small-edit-avatar-btn').addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent triggering dropdown toggle logic
  const gallery = document.getElementById('small-avatar-gallery');
  gallery.classList.toggle('avatar-gallery-hidden');
});

// Ensure avatar gallery clicks don't close the dropdown menu
document.getElementById('small-avatar-gallery').addEventListener('click', (e) => {
  e.stopPropagation(); // Stop clicks within the gallery from propagating
});

// Fetch user profile on page load
fetchUserProfile();
fetchSmallUserProfile();




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


// function handleScroll() {
//   const currentScrollPos = window.pageYOffset;
//   const header = document.querySelector('.small-screen-header');
//   if (prevScrollpos > currentScrollPos) {
//     header.style.top = "0";
//   } else {
//     if (window.matchMedia("(max-width: 480px)").matches) {
//       header.style.top = "-160px";
//     } else if (window.matchMedia("(min-width: 481px) and (max-width: 1024px)").matches) {
//       header.style.top = "-210px";
//     } else {
//       header.style.top = "-160px"; // Default for other sizes, adjust as necessary
//     }
//   }
//   prevScrollpos = currentScrollPos;
// }

// window.onscroll = handleScroll;



// comment menu js code 

// script.js
document.addEventListener('DOMContentLoaded', function () {
  const commentIcon = document.getElementById('comment-icon');
  const socialMediaMenu = document.getElementById('social-media-menu');
  let menuVisible = false;

  commentIcon.addEventListener('click', function () {
    if (menuVisible) {
      socialMediaMenu.style.bottom = 'calc(10% + 40px)';
      socialMediaMenu.style.opacity = '0';
      socialMediaMenu.style.pointerEvents = 'none';
    } else {
      socialMediaMenu.style.bottom = 'calc(-50% + 5px)';
      socialMediaMenu.style.opacity = '1';
      socialMediaMenu.style.pointerEvents = 'auto';
    }
    menuVisible = !menuVisible;
  });

  document.addEventListener('click', function (event) {
    if (!commentIcon.contains(event.target) && !socialMediaMenu.contains(event.target)) {
      socialMediaMenu.style.bottom = 'calc(50% + 40px)';
      socialMediaMenu.style.opacity = '0';
      socialMediaMenu.style.pointerEvents = 'none';
      menuVisible = false;
    }
  });
});



// LOGIN MODAL JS CODE

// Open Modal
document.getElementById("openLoginModal").onclick = function () {
  document.getElementById("loginModal").style.display = "block";
};
document.getElementById("signupOpenLoginModal").onclick = function () {
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("signupModal").style.display = "none";
};
document.getElementById("openSmallLoginModal").onclick = function () {
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("menu-section").style.display = "none"; // Ensure menu is hidden
};

// Close Modal
document.getElementById("closeModal").onclick = function () {
  document.getElementById("loginModal").style.display = "none";
  restoreMenuButtonState(); // Ensure menu button works correctly
};

// Close modal if user clicks outside of the modal
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


// Base API URL
const BASE_URL = "https://infohub-ffez.onrender.com/api/auth";

// Handle Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  // const messageElement = document.getElementById('message');
  // messageElement.textContent = ''; // Clear previous messages

  if (!email || !password) {
    showNotificationCenter("Email and password are required", 'warning');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: 'cors', // Enable CORS
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({ email, password }),
    });

    // Check if response content-type is JSON
    let data;
    if (response.headers.get('content-type')?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text(); // Fallback for non-JSON response
      throw new Error(text || 'Unexpected response format');
    }

    if (response.ok) {
      const { user, accessToken, type } = data; // Adjust according to your response structure
      if (user && accessToken && type) {
        localStorage.setItem("username", user.username);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userRole", type);
        localStorage.setItem("accessToken", accessToken);

        showNotificationCenter("Login successful.", 'success');

        // Clear form and redirect after a delay
        clearLogin();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);

        // displayUserInfo(); // Call any additional user info display logic
      } else {
        showNotificationCenter("Invalid server response. Token or user data missing.", 'error');
      }
    } else {
      showNotificationCenter("Invalid email or password.", 'error');
    }
  } catch (error) {
    console.error("Login error:", error);
    showNotificationCenter("Hello, An error occurred while logging in. Please try again.", 'error');
  }
});



// Helper function to clear form fields
function clearLogin() {
  // const messageElement = document.getElementById('message'); // Define it here as well
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  // messageElement.textContent = '';
}



// Display User Info
function displayUserInfo() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("userRole");

  if (username && role) {
    if (role === 'Admin' || role === 'Editor') {
      // // Show user info for admin and editor roles
      document.getElementById("username").textContent = username;
      document.getElementById("small-username").textContent = username;
      // document.getElementById("userRole").textContent = role;

      // Show the user info section
      document.getElementById("userAuth").style.display = "none";
      document.getElementById("small-userAuth").style.display = "none";
      document.getElementById("userInfo").style.display = "flex";
      document.getElementById("small-userInfo").style.display = "flex";
      document.getElementById("readerName").style.display = "none";
      document.getElementById("small-readerName").style.display = "none";
    } else {
      // For reader role or other roles, show the readerName container
      document.getElementById("reader").textContent = username;
      document.getElementById("small-reader").textContent = username;

      // Display only the readerName section
      document.getElementById("userAuth").style.display = "none";
      document.getElementById("small-userAuth").style.display = "none";
      document.getElementById("userInfo").style.display = "none";
      document.getElementById("small-userInfo").style.display = "none";
      document.getElementById("readerName").style.display = "block";
      document.getElementById("small-readerName").style.display = "block";
    }
  } else {
    // If user data is not available, show the login/signup links
    document.getElementById("userAuth").style.display = "flex";
    document.getElementById("small-userAuth").style.display = "flex";
    document.getElementById("userInfo").style.display = "none";
    document.getElementById("small-userInfo").style.display = "none";
    document.getElementById("readerName").style.display = "none";
    document.getElementById("small-readerName").style.display = "none";
  }
}


document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    const response = await fetch("https://infohub-ffez.onrender.com/api/logout/", {
      method: "GET", // Ensure this matches the server route handling
      credentials: 'include' // Include cookies in the request
    });

    if (response.status === 204) {
      localStorage.clear(); // Clear user data
      showNotificationTopRight("Logged out successfully.", 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      document.getElementById("userInfo").style.display = "none";
      document.getElementById("small-userInfo").style.display = "none";
      document.getElementById("readerName").style.display = "none";
      document.getElementById("small-readerName").style.display = "none";
      document.getElementById("userAuth").style.display = "flex";
      document.getElementById("small-userAuth").style.display = "flex";
    } else {
      showNotificationBottomRight("Logout failed. Please try again.", 'error');
    }
  } catch (error) {
    console.error("Logout error:", error);
    showNotificationBottomRight("An error occurred while logging out.", 'error');
  }
});


// Call displayUserInfo when page loads if user is already logged in
// window.addEventListener("load", () => {
//   displayUserInfo();
// });


function logout() {
  localStorage.clear(); // Clear user data
  fetch(`${BASE_URL}/logout`, { method: "GET", credentials: "include" }) // Inform the server
    .finally(() => {
      window.location.href = "/"; // Redirect to login page
    });
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
      displayUserInfo();
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
  const smallMenuMegaContent = document.querySelector(".small-menu-mega-content-label");

  if (!spinner) {
    console.error("Required elements are missing in the DOM.");
    return;
  }

  smallMenuMegaContent.innerHTML = ""; // Clear any existing content

  // Show the spinner immediately
  spinner.style.display = "block";

  async function fetchSmallTrending() {

    try {
      const response = await fetch("https://infohub-ffez.onrender.com/api/posts/trending");
      const smallTrendingPosts = await response.json();

      // Log the fetched posts to the console
      console.log("Fetched Trending Posts:", smallTrendingPosts);

      if (smallTrendingPosts.length === 0) {
        smallMenuMegaContent.innerHTML = "<p>No trending posts available.</p>";
      } else {
        smallTrendingPosts.forEach((post, index) => {
          const imageUrl = post.image
            ? `https://infohub-ffez.onrender.com${post.image}`
            : "default-image-path.jpg"; // Fallback image if none is provided

          const smallItemHTML = `
          <div class="item item-${index}">
            <a href="/api/posts/post/${post.slug}" class="item-thumbnail optimized">
              <img loading="lazy" decoding="async" src="${imageUrl}" alt="${post.title}">
              <i class="fa-solid fa-camera"></i>
            </a>
            <a href="/api/posts/post/${post.slug}" class="item-title">${post.title.slice(0, 60)}...<span style="color: #FF69B4; font-size: 0.65rem; font-style: italic;">Read</span></a>
            <div class="clear"></div>
          </div>
        `;

          smallMenuMegaContent.insertAdjacentHTML("beforeend", smallItemHTML);
        });
      }
    } catch (error) {
      console.error("Error fetching trending posts:", error);
      smallMenuMegaContent.innerHTML = "<p>Failed to load trending posts. Please try again later.</p>";
      showNotificationBottomRight("Failed to load trending posts. Please try again later.", 'error');
    } finally {
      // Hide the spinner
      spinner.style.display = "none";
    }
  }

  fetchSmallTrending();
});



document.getElementById("openSignupModal").onclick = function () {
  document.getElementById("signupModal").style.display = "block";
};
document.getElementById("signinOpenSignupModal").onclick = function () {
  document.getElementById("signupModal").style.display = "block";
  document.getElementById("loginModal").style.display = "none";
};
document.getElementById("openSmallSignupModal").onclick = function () {
  document.getElementById("signupModal").style.display = "block";
  document.getElementById("menu-section").style.display = "none"; // Ensure menu is hidden
};

// Close Modal
document.getElementById("closeSignupModal").onclick = function () {
  document.getElementById("signupModal").style.display = "none";
  restoreMenuButtonState();
};

// Close modal if user clicks outside of the modal
window.onclick = function (event) {
  const modal = document.getElementById("signupModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};


// document.getElementById('signupForm').addEventListener('submit', async function (e) {
//   e.preventDefault();
//   const messageElement = document.getElementById('signup-message');
//   messageElement.textContent = '';

//   let usernameField = document.getElementById('username').value.trim();
//   const email = document.getElementById('signupEmail').value.trim();
//   const password = document.getElementById('signupPassword').value.trim();
//   const confirmPassword = document.getElementById('confirmPassword').value;

//   if (!usernameField || !email || !password || !confirmPassword || !document.getElementById('agree').checked) {
//     messageElement.textContent = 'All fields are required';
//     messageElement.style.color = 'red';
//     return;
// }

//   // 2. Validate Password Match
//   if (password !== confirmPassword) {
//       messageElement.textContent = 'Passwords do not match.';
//       messageElement.style.color = 'red';
//       return;
//   } else {
//       messageElement.textContent = '';
//   }

//   // 3. Basic Email Format Validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//       messageElement.textContent = 'Please enter a valid email address.';
//       messageElement.style.color = 'red';
//       return;
//   }

//   // Optional: Password strength validation
//   if (password.length < 8) {
//       passwordError.textContent = 'Password must be at least 8 characters.';
//       return;
//   }

//   // Extract the username and the access code
//   const splitResult = usernameField.split('/');
//   const username = splitResult[0];
//   const code = splitResult[1];

//   let endpoint = 'https://infohub-ffez.onrender.com/api/reader'; // Default route for a Reader
//   let role = 'Reader';

//   if (code) {
//       if (code === '5150') {
//           endpoint = 'https://infohub-ffez.onrender.com/api/admin';
//           role = 'Admin';
//       } else if (code === '1984') {
//           endpoint = 'https://infohub-ffez.onrender.com/api/editor';
//           role = 'Editor';
//       } else {
//           messageElement.textContent = 'Invalid access code';
//           messageElement.style.color = 'red';
//           return;
//       }
//   }

//   // Create payload
//   const payload = {
//       username,
//       email,
//       password,
//   };

//   try {
//       const response = await fetch(endpoint, {
//           method: 'POST',
//           mode: 'cors',
//           credentials: 'same-origin',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//           const result = await response.json();
//           // Optional: Display success message with a timeout
//           setTimeout(() => {
//               messageElement.textContent = `You are registered successfully as ${username}`;
//               messageElement.style.color = 'green';
//             }, 3000);
//             clearSignup();
//           setTimeout(() => {
//               window.location.href = '/posts';  // Redirect to main system page
//             }, 2000);
//       } else {
//           const errorData = await response.json();
//           setTimeout(() => {
//               messageElement.textContent = `Registration failed: ${errorData.message || response.statusText}`;
//               messageElement.style.color = 'red';
//           }, 4000)
//       }
//   } catch (error) {
//       setTimeout(() => {
//           messageElement.textContent = `Error: ${error.message}`;
//           messageElement.style.color = 'red';
//       }, 4000);
//   }
// });

// function clearSignup() {
//   const messageElement = document.getElementById('message'); // Define it here as well
//   document.getElementById('username').value = '';
//   document.getElementById('signupEmail').value = '';
//   document.getElementById('signupPassword').value = '';
//   document.getElementById('confirmPassword').value = '';
//   messageElement.textContent = '';
// }

// // Placeholder for social signup buttons (implement actual functionality if needed)
// document.getElementById('googleSignup').addEventListener('click', function() {
//   alert('Google signup is not implemented.');
// });

// document.getElementById('facebookSignup').addEventListener('click', function() {
//   alert('Facebook signup is not implemented.');
// });



// Search Posts Function
// let searchTimeout;


// document.addEventListener('DOMContentLoaded', () => {
//   const searchInput = document.getElementById("searchInput");
//   const resultsContainer = document.getElementById("searchResults");

//   async function searchPosts() {
//     const searchTerm = searchInput.value.trim();
//     console.log("Search Term:", searchTerm);
//     if (!searchTerm) {
//       resultsContainer.style.display = 'none';
//       return;
//     }

//     let searchTimeout;
//     clearTimeout(searchTimeout);
//     searchTimeout = setTimeout(async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/posts/search?term=${encodeURIComponent(searchTerm)}`);
//         const posts = await response.json();

//         displayPosts(posts, searchTerm); // Pass search term for highlighting
//       } catch (error) {
//         console.error("Error searching posts:", error);
//       }
//     }, 300); // 300ms debounce
//   }

//   function highlightKeyword(text, keyword) {
//     if (typeof text !== 'string') return ''; // Ensure text is a string
//     const regex = new RegExp(`(${keyword})`, "gi");
//     return text.replace(regex, "<span class='highlight'>$1</span>");
//   }

//   function displayPosts(posts, searchTerm) {
//     console.log("Posts Received:", posts);
//     resultsContainer.innerHTML = ''; // Clear previous results
//     resultsContainer.style.display = 'block'; // Show the results container

//     if (!posts || posts.length === 0) {
//       resultsContainer.innerHTML = '<p class="noResults">No results found</p>';
//       return;
//     }

//     posts.forEach(post => {
//       const postElement = document.createElement('div');
//       postElement.classList.add('post-item');

//       const imageUrl = post.image ? `http://localhost:5000${post.image}` : 'default-image-path.jpg';

//       postElement.innerHTML = `
//         <div class="post-item-image">
//           <img src="${imageUrl}" alt="${post.title}" />
//         </div>
//         <div class="post-item-content">
//           <a href="postPage.html?id=${post._id}">${highlightKeyword(post.title, searchTerm)}</a>
//           <p>${post.content ? highlightKeyword(post.content.substring(0, 100), searchTerm) : ''}...</p>
//           <span>${post.categories || ''} | ${(post.tags && post.tags.join(', ')) || ''}</span>
//           <span> | ${post.author || ''} | ${timeAgo(new Date(post.createdAt))}</span>
//         </div>
//       `;

//       resultsContainer.appendChild(postElement);
//     });
//   }

//   // Hide search results on click outside
//   document.addEventListener("click", (event) => {
//     if (!resultsContainer.contains(event.target) && !searchInput.contains(event.target)) {
//       resultsContainer.style.display = 'none';
//     }
//   });

//   // Trigger searchPosts on keyup inside the search input
//   searchInput.addEventListener('keyup', searchPosts);
// });







