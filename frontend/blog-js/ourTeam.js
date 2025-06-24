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

      if (window.matchMedia("(min-width: 481px) and (max-width: 1023px)").matches) {
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
      socialMediaMenu.style.bottom = 'calc(-15% + 70px)';
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
                        <i class="gi-solid gi-camera"></i>
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

document.addEventListener("DOMContentLoaded", async () => {
  const spinner = document.getElementById("spinner");
  const menuMegaContent = document.querySelector(".small-menu-mega-content-label");

  if (!spinner) {
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
                        <i class="gi-solid gi-camera"></i>
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



// authorDetails.js
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');

  if (!username) return;

  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`https://infohub-ffez.onrender.com/api/user/author/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to load author details');

    const { authorDetails, articleCount, categories, posts, currentPage, totalPages } = await response.json();

    // Populate author and category details
    populateAuthorDetails({ ...authorDetails, categories, articleCount });

    // Initial articles and set up pagination
    populateAuthorArticles(posts);
    setupPagination(username, currentPage, totalPages); // Pass currentPage and totalPages
  } catch (error) {
    console.error('Error loading author details:', error);
    showNotificationBottomRight(error.message, 'error');
  }
});


function populateAuthorDetails(author) {
  // Basic details
  document.getElementById('author-image-avatar').src = author.avatar;
  document.getElementById('author-username').textContent = author.username;
  document.getElementById('author-bio').textContent = author.bio || 'No bio available';
  document.getElementById('author-education').textContent = author.education || 'N/A';
  document.getElementById('author-experience').textContent = author.workExperience || 'N/A';
  document.getElementById('author-awards').textContent = author.awards || 'N/A';
  document.getElementById('article-count').textContent = author.articleCount || 0;
  document.getElementById('author-reg-date').textContent = new Date(author.createdAt).toLocaleDateString();
  document.getElementById('author-name').textContent = author.username;
  document.title = `${author.username}, Profile and All Articles on Infohub Naija`;


  // Social media links
  const socialHandles = author.socialMediaHandles || {};

  const socialLinksData = {
    facebook: { icon: 'fab fa-facebook', color: '#1877F2' },
    twitter: { icon: 'fab fa-twitter', color: '#1DA1F2' },
    instagram: { icon: 'fab fa-instagram', color: '#E4405F' },
    linkedin: { icon: 'fab fa-linkedin', color: '#0A66C2' },
  };

  const socialLinksContainer = document.querySelector('.author-social-handles');
  socialLinksContainer.innerHTML = ''; // Clear any existing content

  Object.keys(socialLinksData).forEach(platform => {
    if (socialHandles[platform]) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = socialHandles[platform];
      a.target = '_blank';
      a.style.color = socialLinksData[platform].color;
      a.innerHTML = `<i class="${socialLinksData[platform].icon}"></i>`;
      li.appendChild(a);
      socialLinksContainer.appendChild(li);
    }
  });

  // Populate categories
  const categoriesList = document.getElementById('author-categories');
  categoriesList.innerHTML = ''; // Clear existing content
  author.categories.forEach(category => {
    const li = document.createElement('li');
    li.textContent = `${category._id} (${category.count})`;
    li.title = `${category._id} Category, Articles: ${category.count}`; // Add title attribute
    categoriesList.appendChild(li);
  });
}

function populateAuthorArticles(posts) {
  const articlesContainer = document.getElementById('author-articles');
  articlesContainer.innerHTML = ''; // Clear existing content
  posts.forEach(post => {
    const articleDiv = document.createElement('div');
    articleDiv.className = 'article-card';
    articleDiv.innerHTML = `
    <div class="tech-article-headline topic">
          <img loading="lazy" src="${post.image || 'images/default-image.jpg'}" alt="${post.title}">
          <div class="tech-headline-info">
            <h2><a href="#">${post.categories}</a></h2>
            <p><a href="/api/posts/post/${post.slug}">${post.title}</a></p>
          </div>
        </div>
        <div class="headline-brief">
          <p>${post.content.slice(0, 80)}...<span class="readmore-link"><a href="/api/posts/post/${post.slug}">Read</a></span></p>
          <hr class="section-divider">
          <div class="icon">
            <a href="#"><span><i class="fas fa-clock icon"></i>${formatPostDate(new Date(post.createdAt))}</span></a>
          </div>
        </div>
    `;
    articlesContainer.appendChild(articleDiv);
  });
}

function setupPagination(username, currentPage, totalPages) {
  const loadMoreButton = document.getElementById('load-more-articles');
  if (currentPage >= totalPages) {
    loadMoreButton.style.display = 'none';
    return;
  }

  loadMoreButton.addEventListener('click', async () => {
    try {
      const nextPage = currentPage + 1; // Increment the current page
      const response = await fetch(`https://infohub-ffez.onrender.com/api/user/author/${username}?page=${nextPage}&limit=6`);
      const { posts, currentPage: newCurrentPage, totalPages: newTotalPages } = await response.json();

      populateAuthorArticles(posts); // Load more articles
      setupPagination(username, newCurrentPage, newTotalPages); // Update pagination state
    } catch (error) {
      console.error('Error loading more articles:', error);
    }
  });
}


document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://infohub-ffez.onrender.com/api/user/authors');
    if (!response.ok) throw new Error('Failed to fetch authors');

    const authors = await response.json();
    populateAuthors(authors);
  } catch (error) {
    console.error('Error loading authors:', error);
  }
});

function populateAuthors(authors) {
  const authorsSection = document.getElementById('authors-section');

  authors.forEach(author => {
    const card = document.createElement('div');
    card.className = 'author-card';
    card.innerHTML = `
                <img src="${author.avatar}" alt="${author.username}'s avatar">
                <div class="author-details">
                  <p class="author-name">${author.username}</p>
                  <p class="author-category"><strong>Specializes in:</strong> ${author.specialty || 'General'}</p>
                  <a href="/author-profile?username=${author.username}" class="view-profile">
                  View Profile <i class="fas fa-arrow-right"></i>
                </a>
                </div>
                
              `;
    authorsSection.appendChild(card);
  });
}


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