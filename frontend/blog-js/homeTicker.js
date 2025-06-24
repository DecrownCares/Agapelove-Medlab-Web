function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) return `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  interval = Math.floor(seconds / 604800);
  if (interval > 1) return `${interval} weeks ago`;
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  return `${Math.floor(seconds)} seconds ago`;
}

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



// document.addEventListener("DOMContentLoaded", async () => {
//   const spinner = document.getElementById("spinner");
//   const menuMegaContent = document.querySelector(".menu-mega-content-label");

//   if (!spinner || !menuMegaContent) {
//     console.error("Required elements are missing in the DOM.");
//     return;
//   }

//   menuMegaContent.innerHTML = ""; // Clear any existing content

//   // Show the spinner immediately
//   spinner.style.display = "block";

//   try {
//     const response = await fetch("https://infohub-ffez.onrender.com/api/posts/trending");
//     const trendingPosts = await response.json();

//     // Log the fetched posts to the console
//     console.log("Fetched Trending Posts:", trendingPosts);

//     if (trendingPosts.length === 0) {
//       menuMegaContent.innerHTML = "<p>No trending posts available.</p>";
//     } else {
//       trendingPosts.forEach((post, index) => {
//         const imageUrl = post.image
//           ? `https://infohub-ffez.onrender.com${post.image}`
//           : "default-image-path.jpg"; // Fallback image if none is provided

//         const itemHTML = `
//           <div class="item item-${index}">
//             <a href="/postPage?slug=${post.slug}" class="item-thumbnail optimized">
//               <img loading="lazy" decoding="async" src="${imageUrl}" alt="${post.title}">
//               <i class="gi-solid gi-camera"></i>
//             </a>
//             <a href="/postPage?slug=${post.slug}" class="item-title">${post.title.slice(0, 60)}...<span style="color: #FF69B4; font-size: 0.65rem; font-style: italic;">Read</span></a>
//             <div class="clear"></div>
//           </div>
//         `;

//         menuMegaContent.insertAdjacentHTML("beforeend", itemHTML);
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching trending posts:", error);
//     menuMegaContent.innerHTML = "<p>Failed to load trending posts. Please try again later.</p>";
//   } finally {
//     // Hide the spinner
//     spinner.style.display = "none";
//   }
// });
// document.addEventListener("DOMContentLoaded", async () => {
//   const spinner = document.getElementById("spinner");
//   const menuMegaContent = document.querySelector(".small-menu-mega-content-label");

//   if (!spinner || !menuMegaContent) {
//     console.error("Required elements are missing in the DOM.");
//     return;
//   }

//   menuMegaContent.innerHTML = ""; // Clear any existing content

//   // Show the spinner immediately
//   spinner.style.display = "block";

//   try {
//     const response = await fetch("https://infohub-ffez.onrender.com/api/posts/trending");
//     const trendingPosts = await response.json();

//     // Log the fetched posts to the console
//     console.log("Fetched Trending Posts:", trendingPosts);

//     if (trendingPosts.length === 0) {
//       menuMegaContent.innerHTML = "<p>No trending posts available.</p>";
//     } else {
//       trendingPosts.forEach((post, index) => {
//         const imageUrl = post.image
//           ? `https://infohub-ffez.onrender.com${post.image}`
//           : "default-image-path.jpg"; // Fallback image if none is provided

//         const itemHTML = `
//           <div class="item item-${index}">
//             <a href="/postPage?slug=${post.slug}" class="item-thumbnail optimized">
//               <img loading="lazy" decoding="async" src="${imageUrl}" alt="${post.title}">
//               <i class="gi-solid gi-camera"></i>
//             </a>
//             <a href="/postPage?slug=${post.slug}" class="item-title">${post.title.slice(0, 60)}...<span style="color: #FF69B4; font-size: 0.65rem; font-style: italic;">Read</span></a>
//             <div class="clear"></div>
//           </div>
//         `;

//         menuMegaContent.insertAdjacentHTML("beforeend", itemHTML);
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching trending posts:", error);
//     menuMegaContent.innerHTML = "<p>Failed to load trending posts. Please try again later.</p>";
//   } finally {
//     // Hide the spinner
//     spinner.style.display = "none";
//   }
// });




document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");
  const spinner = document.getElementById("search-spinner");

  let searchTimeout;

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
    }, 2000); // 2000ms (2 seconds) debounce
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
});
document.getElementById("footer-newsletterModal").addEventListener("click", function () {
  document.getElementById("newsletter-overlay").style.display = "flex";
});

document.getElementById("small-updatesModal").addEventListener("click", function () {
  document.getElementById("updates-overlay").style.display = "flex";
});
document.getElementById("footer-updatesModal").addEventListener("click", function () {
  document.getElementById("updates-overlay").style.display = "flex";
});

document.getElementById("close-newsletter-form").addEventListener("click", function () {
  document.getElementById("newsletter-overlay").style.display = "none";
});

document.getElementById("close-updates-form").addEventListener("click", function () {
  document.getElementById("updates-overlay").style.display = "none";
});


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



async function updateSlideshow() {
  console.log('updateSlideshow started');
  try {
    const response = await fetch('https://infohub-ffez.onrender.com/api/posts/top-pick');
    const posts = await response.json();

    const heroSection = document.querySelector('.hero-section');
    console.log('Hero Section:', heroSection);

    if (!heroSection) {
      console.error('Element with class "hero-section" not found in the DOM.');
      return;
    }

    const categories = Object.keys(posts);


    heroSection.innerHTML = categories.map((category, index) => {
      const post = posts[category];
      if (!post) return "";

      const sponsoredLabel = post.isSponsored
        ? '<div class="hero-sponsored-label"><i class="fas fa-bullhorn"></i>&nbsp; Sponsored</div>'
        : '';

      return `
              <div class="hero-item slide${index + 1}">
                  ${sponsoredLabel}
                  <div class="hero-image-container">
                    <img src="${post.image}" alt="${category}">
                  </div>
                  <div class="hero-content">
                      <div class="icons">
                          <span><i class="fas fa-comments icon"></i> ${Array.isArray(post.comments) ? post.comments.length : 0}</span>
                          <span><i class="fas fa-user icon"></i> ${post.author?.username || "Unknown"}</span>
                          <span><i class="fas fa-clock icon"></i> ${formatPostDate(new Date(post.createdAt))}</span>
                      </div>
                      <p>${category}</p>
                      <h1>${post.title}</h1>
                      <a href="/api/posts/post/${post.slug}" class="cta-button">Explore</a>
                  </div>
              </div>
          `;
    }).join('');

    let dots = document.getElementById('dots');
    if (!dots) {
      console.warn('Dots element not found. Creating dynamically.');
      dots = document.createElement('div');
      dots.id = 'dots';
      dots.className = 'dots';
      heroSection.appendChild(dots);
    }

    dots.innerHTML = categories
      .map((_, index) => `<span class="dot" data-slide="${index}"></span>`)
      .join('');

    initializeHeroSlider();
  } catch (error) {
    console.error('Error fetching or rendering posts:', error);
  }
}


// JavaScript for Hero Slider
function initializeHeroSlider() {
  const heroItems = document.querySelectorAll('.hero-item');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  let slideInterval;

  if (heroItems.length === 0 || dots.length === 0) {
    console.error('No hero items or dots found.');
    return;
  }

  // Helper function to show a slide
  function showSlide(index) {
    // Ensure index wraps around correctly (handle 12 slides but only 12 dots)
    heroItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      // Active dot should reflect the correct slide index
      dot.classList.toggle('active', i === index);
    });
  }

  // Function to start the slider
  function startSlider() {
    showSlide(currentIndex);
    slideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % heroItems.length;
      showSlide(currentIndex);
    }, 5000);
  }

  // Function to navigate to a specific slide
  function goToSlide(index) {
    clearInterval(slideInterval);
    currentIndex = index % heroItems.length; // Ensure it wraps around to avoid out-of-bound errors
    showSlide(currentIndex);
    startSlider(); // Restart auto sliding
  }

  // Attach click event to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // Fix: Ensure dots sync with all slides properly even during preloaded
  for (let i = 0; i < heroItems.length; i++) {
    dots[i]?.classList.add('used') // Optional CSS identify fix or track
  }
  startSlider(); // Start running if timer expires
}



// Dot for the 'Two image slide'
let newCurrentSlideIndex = 0;
let direction = 1; // 1 for forward, -1 for backward
const newSlidesWrapper = document.querySelector('.new-slides-wrapper');
const newDotsContainer = document.querySelector('.new-dots');
const slides = document.querySelectorAll('.new-slide');
let slidesToShow = window.innerWidth <= 768 ? 1 : 3; // 1 slide on small screen, 3 slides on large screen
let totalDots = slidesToShow === 1 ? slides.length * 2 : slides.length;

function updateDots() {
  newDotsContainer.innerHTML = ''; // Clear existing dots
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('span');
    dot.classList.add('new-dot');
    dot.addEventListener('click', () => newCurrentSlide(i));
    newDotsContainer.appendChild(dot);
  }
  showNewSlide(newCurrentSlideIndex); // Ensure the current slide is shown after updating dots
}

function showNewSlide(index) {
  const offset = -index * (100 / totalDots);
  newSlidesWrapper.style.transform = `translateX(${offset}%)`;
  const newDots = document.querySelectorAll('.new-dot');
  newDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextNewSlide() {
  if (newCurrentSlideIndex === totalDots - 1) {
    direction = -1;
  } else if (newCurrentSlideIndex === 0) {
    direction = 1;
  }
  newCurrentSlideIndex += direction;
  showNewSlide(newCurrentSlideIndex);
}

function newCurrentSlide(index) {
  newCurrentSlideIndex = index;
  showNewSlide(newCurrentSlideIndex);
}

showNewSlide(newCurrentSlideIndex);
setInterval(nextNewSlide, 5000);

window.addEventListener('resize', () => {
  slidesToShow = window.innerWidth <= 768 ? 1 : 3;
  totalDots = slidesToShow === 1 ? slides.length * 2 : slides.length;
  updateDots();
  showNewSlide(newCurrentSlideIndex);
});

updateDots();
// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', updateSlideshow);



let currentIndices = {}; // To store the current index for each category
let categorySlides = {}; // To store slides for each category

// General function to show a slide for the given category
function showSlide(category, index) {
  const slides = categorySlides[category];
  const dots = document.querySelectorAll(`.new-dot[data-category="${category}"]`);

  slides.forEach((slide, i) => {
    // Sliding effect for Travel and Entertainment
    slide.style.transform = `translateX(${(i - index) * 100}%)`;
    slide.style.transition = 'transform 0.8s ease'; // Adjusted for smooth transition
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index); // Highlight the active dot
  });
}

// Function to set the current slide for a category
function setCurrentSlide(category, index) {
  currentIndices[category] = index;
  showSlide(category, index);
}

// Function to go to the next slide with infinite reverse behavior
function nextSlide(category) {
  const slides = categorySlides[category];
  let nextIndex = currentIndices[category] + 1;

  if (nextIndex >= slides.length) {
    // Reverse the direction smoothly
    slides.forEach((slide, i) => {
      slide.style.transition = 'none'; // Temporarily disable transition
      slide.style.transform = `translateX(${(i - 0) * 100}%)`;
    });
    nextIndex = 1; // Move to the second slide
    setTimeout(() => {
      slides.forEach((slide, i) => {
        slide.style.transition = 'transform 0.8s ease';
      });
      setCurrentSlide(category, nextIndex);
    }, 50); // Delay to allow transition reset
  } else {
    setCurrentSlide(category, nextIndex);
  }
}

// Function to start the slideshow for a given category
function startSlideshow(category) {
  categorySlides[category] = document.querySelectorAll(`.new-slide[data-category="${category}"]`);

  // Initialize current index for the category
  currentIndices[category] = 0;

  // Apply initial styles for sliding effect
  categorySlides[category].forEach((slide, i) => {
    slide.style.position = 'absolute';
    slide.style.top = '0';
    slide.style.left = '0';
    slide.style.width = '100%';
    slide.style.transform = `translateX(${i * 100}%)`;
  });

  setCurrentSlide(category, currentIndices[category]);

  // Auto-slide every 5 seconds
  setInterval(() => nextSlide(category), 10000);
}

// Start slideshows for categories on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  startSlideshow('Travel');
  startSlideshow('Entertainment');
});



// Function to load posts for Travel or Entertainment category (2 images per slide on larger screens, 1 image per slide on smaller screens)
// Initialize the posts for each category
document.addEventListener('DOMContentLoaded', () => {
    loadTravelEntertainmentPosts('Entertainment'); // Load Entertainment category
    loadTravelEntertainmentPosts('Travel'); // Load Travel category
    loadSportsPosts(); // Load Sports category
  });
  
  // Function to load posts for Travel or Entertainment category (2 images per slide on larger screens, 1 image per slide on smaller screens)
  async function loadTravelEntertainmentPosts(category) {
    try {
      const response = await fetch('https://infohub-ffez.onrender.com/api/posts/homepage-posts');
      const data = await response.json();
  
      const categoryData = data.find(item => item.categories === category);
      if (!categoryData || categoryData.posts.length === 0) {
        document.querySelector(`.new-slideshow-container[data-category="${category}"]`).style.display = 'none';
        return;
      }
  
      const slideWrapper = document.querySelector(`.new-slides-wrapper[data-category="${category}"]`);
      const dotsContainer = document.querySelector(`.new-dots[data-category="${category}"]`);
  
      slideWrapper.innerHTML = '';
      dotsContainer.innerHTML = '';
  
      // Get the available posts and repeat them to make sure there are 6 items
      let posts = categoryData.posts.length === 1 ? 
        [categoryData.posts[0], categoryData.posts[0], categoryData.posts[0]] : 
        categoryData.posts;
  
      // If posts are fewer than 6, repeat them to fill the slides
      posts = [...posts, ...posts.slice(0, 6 - posts.length)];
  
      // Create the slides with 2 images per slide on larger screens, 1 image per slide on smaller screens
      posts.slice(0, 6).forEach((post, index) => {
        const slide = document.createElement('div');
        slide.classList.add('new-slide');
        slide.dataset.category = category;
  
        const slideItem1 = `
          <div class="new-slide-item">
            <img src="${post.image}" alt="Slide ${index + 1}">
            <div class="content">
              <h2><a href="/posts?category=${post.categories}">${post.categories}</a></h2>
              <p><a href="/api/posts/post/${post.slug}" class="category-link" data-category="${category}">${post.title}</a></p>
            </div>
          </div>
        `;
        
        const slideItem2 = `
          <div class="new-slide-item">
            <img src="${post.image}" alt="Slide ${index + 2}">
            <div class="content">
              <h2><a href="/posts?category=${post.categories}">${post.categories}</a></h2>
              <p><a href="/api/posts/post/${post.slug}" class="category-link" data-category="${category}>${post.title || 'Discover more about this post.'}</a></p>
            </div>
          </div>
        `;
        
        slide.innerHTML = window.innerWidth > 768 ? slideItem1 + slideItem2 : slideItem1; // Two images per slide on larger screens, one image per slide on smaller screens
        slideWrapper.appendChild(slide);
  
        // Create a dot for each slide
        const dot = document.createElement('span');
        dot.classList.add('new-dot');
        dot.onclick = () => setCurrentSlide(category, index);
        dotsContainer.appendChild(dot);
      });
  
      setCurrentSlide(category, 0); // Show the first slide by default
      startSlideshow(category); // Start the automatic slideshow for this category
  
    } catch (error) {
      console.error(`Error loading ${category} posts:`, error);
    }
  }
  
  // Function to load posts for Sports category (1 image per slide)
  let sportsCurrentIndex = 0;
  let sportsInterval;
  
  // Show the specified slide with fade-in/fade-out effect
  function showSportsSlide(index) {
      const slides = document.querySelectorAll('.sports-slide');
      const dots = document.querySelectorAll('.sports-dot');
  
      if (!slides.length) return;
  
      slides.forEach((slide, i) => {
          slide.style.opacity = i === index ? '1' : '0'; // Fade in/out
          slide.style.zIndex = i === index ? '1' : '0'; // Stack properly
          slide.style.transition = 'opacity 1s ease-in-out';
      });
  
      dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
      });
  }
  
  // Set the current slide
  function setCurrentSportsSlide(index) {
      const slides = document.querySelectorAll('.sports-slide');
      if (!slides.length) return;
  
      sportsCurrentIndex = index % slides.length;
      showSportsSlide(sportsCurrentIndex);
  }
  
  // Start the automatic slideshow
  function startSportsSlideshow() {
      const slides = document.querySelectorAll('.sports-slide');
      if (!slides.length) return;
  
      // Clear any existing interval
      clearInterval(sportsInterval);
  
      sportsInterval = setInterval(() => {
          sportsCurrentIndex = (sportsCurrentIndex + 1) % slides.length;
          setCurrentSportsSlide(sportsCurrentIndex);
      }, 5000); // Change slide every 5 seconds
  }
  
  // Load Sports posts dynamically
  async function loadSportsPosts() {
      try {
          const response = await fetch('https://infohub-ffez.onrender.com/api/posts/homepage-posts');
          const data = await response.json();
  
          const sportsCategory = data.find(item => item.categories === 'Sports');
          if (!sportsCategory || sportsCategory.posts.length === 0) {
              document.querySelector('.sports-slideshow-container').style.display = 'none';
              return;
          }
  
          const slideWrapper = document.querySelector('.sports-slides-wrapper');
          const dotsContainer = document.querySelector('.sports-dots');
  
          slideWrapper.innerHTML = '';
          dotsContainer.innerHTML = '';
  
          let posts = sportsCategory.posts;
          if (posts.length < 6) {
              posts = [...posts, ...posts.slice(0, 6 - posts.length)];
          }
  
          posts.slice(0, 6).forEach((post, index) => {
              const slide = document.createElement('div');
              slide.classList.add('sports-slide');
              slide.innerHTML = `
                  <div class="sports-slide-item">
                      <img src="${post.image}" alt="Slide ${index + 1}">
                      <div class="content">
                          <h2><a href="/posts?category=${post.categories}">${post.categories}</a></h2>
                          <p><a href="/api/posts/post/${post.slug}" class="category-link" data-category="Sports">${post.title || 'Explore this story.'}</a></p>
                      </div>
                  </div>
              `;
              slideWrapper.appendChild(slide);
  
              const dot = document.createElement('span');
              dot.classList.add('sports-dot');
              dot.addEventListener('click', () => setCurrentSportsSlide(index));
              dotsContainer.appendChild(dot);
          });
  
          setCurrentSportsSlide(0);
          startSportsSlideshow();
      } catch (error) {
          console.error('Error loading Sports posts:', error);
      }
  }
  
  document.addEventListener('DOMContentLoaded', loadSportsPosts);



async function loadRomanceCategoryPosts(categories) {
  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/homepage-posts`);
    const data = await response.json();

    console.log('Fetched Home Post Data:', data);

    // Find the category data based on the category name
    const categoryData = data.find(item => item.categories === categories);
    console.log(`Category Data for ${categories}:`, categoryData);

    // If the category has no posts, hide the container
    if (!categoryData || categoryData.posts.length === 0) {
      const categoryContainer = document.querySelector(`[data-category="${categories}"]`);
      if (categoryContainer) {
        categoryContainer.style.display = 'none';
      }
      return;
    }

    // Correctly query the major feed and secondary holder using `[data-category]`
    const majorFeed = document.querySelector(`.major-feed[data-category="${categories}"]`);
    const secondaryHolder = document.querySelector(`.secondary-headline-holder[data-category="${categories}"]`);

    // Ensure these elements exist before attempting to modify them
    if (!majorFeed || !secondaryHolder) {
      console.error('Required elements not found for category:', categories);
      return;
    }

    // Clear the current content in the category section
    majorFeed.innerHTML = '';
    secondaryHolder.innerHTML = '';

     // Get the available posts, and if there are fewer than needed, repeat the posts to fill up
     const posts = categoryData.posts.length === 1 ? 
     [categoryData.posts[0], categoryData.posts[0], categoryData.posts[0]] : 
     categoryData.posts;

   // Clone posts if needed to fill the placeholders
   while (posts.length < 3) {
     posts.push(...categoryData.posts); // Clone available posts until we have at least 3
   }

    // Render the major headline content (the first post)
    const firstPost = posts[0];
    majorFeed.innerHTML = `
      <div class="first-category-topic headline major-headline">
        <a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="Romance"><img src="${firstPost.image}" alt="${firstPost.title}"></a>
        <div class="major-headline-content small-major-headline">
          <a href="/posts?category=${firstPost.categories}"><h2>${firstPost.categories}</h2></a>
          <a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="Romance"><p>${firstPost.title}</p></a>
          <span>By <b class="author"> ${firstPost.author?.username}</b></span>
        </div>
      </div>
      <div class="major-content">
        <p>${firstPost.content.slice(0, 250)}... <span class="read-more-link"><a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="Romance">Read more</a></span></p>
        <div class="icon">
          <a href="#"><span><i class="fas fa-comments icon"></i>${Array.isArray(firstPost.comments) ? firstPost.comments.length : 0}</span></a>
          <a href="#"><span><i class="fas fa-clock icon"></i>${formatPostDate(new Date(firstPost.createdAt))}</span></a>
        </div>
      </div>
    `;

    // Render the secondary headlines (for other posts)
    posts.slice(1).forEach(post => {
      const secondaryPost = `
        <div class="second-category-topic headline minor-headline">
          <img src="${post.image}" alt="${post.title}">
          <div class="headline-content">
            <a href="/posts?category=${post.categories}"><h2>${post.categories}</h2></a>
            <a href="/api/posts/post/${post.slug}" class="category-link" data-category="Romance"><p>${post.title}...</p></a>
          </div>
        </div>
      `;
      secondaryHolder.innerHTML += secondaryPost;
    });
  } catch (error) {
    console.error('Error loading category posts:', error);
  }
}

// Load posts for the "Romance" category when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const category = 'Romance'; // You can dynamically change this based on category
  loadRomanceCategoryPosts(category);
});


async function loadBusinessCategoryPosts(categories) {
  try {
    // Fetch posts from the backend
    const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/homepage-posts`);
    const data = await response.json();

    console.log('Fetched Home Page Data:', data);

    // Find the category data based on the category name
    const categoryData = data.find(item => item.categories === categories);
    console.log(`Category Data for ${categories}:`, categoryData);

    // If the category has no posts, hide the container
    if (!categoryData || categoryData.posts.length === 0) {
      document.querySelector(`.second-category[data-category="${categories}"]`).style.display = 'none';
      return;
    }

    // Get the major feed and secondary headlines holders
    const majorFeed = document.querySelector(`.second-major-feed[data-category="${categories}"]`);
    const secondaryHolder = document.querySelector(`.second-secondary-headline-holder[data-category="${categories}"]`);

    // Clear current content
    majorFeed.innerHTML = '';
    secondaryHolder.innerHTML = '';

    // Get the available posts, and if there are fewer than needed, repeat the posts to fill up
    const posts = categoryData.posts.length === 1 ? 
      [categoryData.posts[0], categoryData.posts[0], categoryData.posts[0]] : 
      categoryData.posts;

    // Clone posts if needed to fill the placeholders
    while (posts.length < 3) {
      posts.push(...categoryData.posts); // Clone available posts until we have at least 3
    }

    // Render the major headline content (first post)
    const firstPost = posts[0];
    majorFeed.innerHTML = `
      <div class="first-category-topic headline second-major-headline">
          <a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="Business"><img src="${firstPost.image}" alt="${firstPost.title}"></a>
          <div class="second-major-headline-content">
              <a href="/posts?category=${firstPost.categories}"><h2>${firstPost.categories}</h2></a>
              <a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="Business"><p>${firstPost.title}</p></a>
              <span>By <a href="#" class="author-link">${firstPost.author?.username}</a></span>
          </div>
      </div>
      <div class="second-major-content">
          <p>${firstPost.content.slice(0, 250)}... <span class="readmore-link"><a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="Business">Readmore</a></span></p>
          <div class="icon">
              <a href="#"><span><i class="fas fa-comments icon"></i>${firstPost.commentsCount || 0}</span></a>
              <a href="#"><span><i class="fas fa-clock icon"></i>${formatPostDate(new Date(firstPost.createdAt))}</span></a>
          </div>
      </div>
    `;

    // Render the secondary headlines (remaining posts)
    posts.slice(1, 4).forEach(post => {
      const secondaryPost = `
        <div class="second-category-topic headline second-minor-headline">
            <div class="second-headline-content">
                <a href="/posts?categories=${post.categories}"><h2>${post.categories}</h2></a>
                <a href="/api/posts/post/${post.slug}" class="category-link" data-category="Business"><p>${post.title}</p></a>
            </div>
        </div>
      `;
      secondaryHolder.innerHTML += secondaryPost;
    });
  } catch (error) {
    console.error('Error loading category posts:', error);
  }
}

// Call the function for the Business category
document.addEventListener('DOMContentLoaded', () => {
  const category = 'Business'; // The category to load
  loadBusinessCategoryPosts(category);
});


async function loadTechPosts(categories) {
  try {
    // Fetch posts from the backend
    const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/homepage-posts`);
    const data = await response.json();

    console.log('Fetched Technology Posts:', data);

    // Find the category data based on the category name
    const categoryData = data.find(item => item.categories === categories);
    console.log(`Category Data for ${categories}:`, categoryData);

    // If the category has no posts, hide the container
    if (!categoryData || categoryData.posts.length === 0) {
      document.querySelector(`.tech-category[data-category="${categories}"]`).style.display = 'none';
      return;
    }

    // Get the container for the tech articles
    const articleContainer = document.querySelector(`.tech-articles-category[data-category="${categories}"]`);

    // Clear the current articles
    articleContainer.innerHTML = '';

    // Get the available posts, and if there are fewer than needed, repeat the posts to fill up
    let posts = categoryData.posts.length === 1 ? 
      [categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0]] : 
      categoryData.posts;

    // Clone posts if needed to fill the placeholders
    while (posts.length < 6) {
      posts.push(...categoryData.posts); // Clone available posts until we have at least 6
    }

    // Create the tech article cards
    posts.slice(0, 6).forEach((post) => {
      const articleCard = document.createElement('div');
      articleCard.classList.add('tech-article-card');

      articleCard.innerHTML = `
        <div class="tech-article-headline topic">
          <img src="${post.image || 'images/default-image.jpg'}" alt="${post.title}">
          <div class="tech-headline-info">
            <h2><a href="/posts?category=${post.categories}">${post.categories}</a></h2>
            <p><a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">${post.title}</a></p>
          </div>
        </div>
        <div class="headline-brief">
          <p>${post.content.slice(0, 100)}...<span class="readmore-link"><a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">Read</a></span></p>
          <hr class="section-divider">
          <div class="icon">
            <a href="#"><span><i class="fas fa-comments icon"></i>${Array.isArray(post.comments) ? post.comments.length : 0}</span></a>
            <a href="#"><span><i class="fas fa-clock icon"></i>${formatPostDate(new Date(post.createdAt))}</span></a>
          </div>
        </div>
      `;

      articleContainer.appendChild(articleCard);
    });

  } catch (error) {
    console.error('Error loading tech posts:', error);
  }
}

// Call the function for the Technology category
document.addEventListener('DOMContentLoaded', () => {
  const category = 'Technology'; // The category to load
  loadTechPosts(category);
});



async function loadFashionPosts(category) {
  try {
    // Fetch posts from the backend
    const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/homepage-posts`);
    const data = await response.json();

    console.log('Fetched Fashion Posts:', data);

    // Find the category data based on the category name
    const categoryData = data.find(item => item.categories === category);
    console.log(`Category Data for ${category}:`, categoryData);

    // If no posts are found in the category, hide the category section
    if (!categoryData || categoryData.posts.length === 0) {
      document.querySelector(`.fashion-category[data-category="${category}"]`).style.display = 'none';
      return;
    }

    // Get the container where the cards will be inserted
    const articleContainer = document.querySelector(`.fashion-articles-category[data-category="${category}"]`);

    // Clear any existing articles
    articleContainer.innerHTML = '';

    // Ensure we have at least 6 posts
    let posts = categoryData.posts.length === 1 ? 
      [categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0]] : 
      categoryData.posts;

    // Clone posts if necessary to fill 6 cards
    while (posts.length < 6) {
      posts.push(...categoryData.posts); // Clone available posts until we have 6
    }

    // Create the fashion article cards dynamically
    posts.slice(0, 6).forEach((post, index) => {
      const articleCard = document.createElement('div');
      articleCard.classList.add('fashion-article-card', `fashion-article-${index + 1}`);

      articleCard.innerHTML = `
        <div class="fashion-article-headline topic">
          <img src="${post.image || 'images/default-image.jpg'}" alt="${post.title}">
          <div class="icon-overlay">
            <i class="fas fa-camera"></i>
          </div>
          <div class="fashion-headline-info">
            <h2><a href="/posts?category=${post.categories}">${post.categories}</a></h2>
            <p class="smaller-screen-font"><a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">${post.title}</a></p>
          </div>
        </div>
      `;

      articleContainer.appendChild(articleCard);
    });

  } catch (error) {
    console.error('Error loading fashion posts:', error);
  }
}

// Call the function to load Fashion posts on page load
document.addEventListener('DOMContentLoaded', () => {
  const category = 'Fashion'; // The category to load
  loadFashionPosts(category);
});



async function loadEducationPosts(category) {
  try {
    // Fetch posts from the backend
    const response = await fetch('https://infohub-ffez.onrender.com/api/posts/homepage-posts');
    const data = await response.json();

    console.log('Fetched Education Posts:', data);

    // Find the category data based on the category name
    const categoryData = data.find(item => item.categories === category);
    console.log(`Category Data for ${category}:`, categoryData);

    // If no posts are found in the category, hide the category section
    if (!categoryData || categoryData.posts.length === 0) {
      document.querySelector(`.education-category[data-category="${category}"]`).style.display = 'none';
      return;
    }

    // Get the container where the widget cards will be inserted
    const articleContainer = document.querySelector(`.education-category-widget[data-category="${category}"]`);

    // Clear any existing articles
    articleContainer.innerHTML = '';

    // Ensure we have at least 6 posts
    let posts = categoryData.posts.length === 1 ?
      [categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0], categoryData.posts[0]] :
      categoryData.posts;

    // Clone posts if necessary to fill 6 cards
    while (posts.length < 6) {
      posts.push(...categoryData.posts); // Clone available posts until we have 6
    }

    // Create the education widget cards dynamically
    posts.slice(0, 6).forEach((post, index) => {
      const widgetCard = document.createElement('div');
      widgetCard.classList.add('widget-card');

      widgetCard.innerHTML = `
        <div class="widget-top">
          <a href="/api/posts/post/${post.slug}" class="widget-link category-link" data-category="${post.categories}">
            <img src="${post.image || 'images/default-image.jpg'}" alt="${post.title}" class="widget-image">
            <div class="icon-overlay">
              <i class="fas fa-camera"></i>
            </div>
            <div class="widget-overlay">
              <a href="/posts?category=${post.categories}">
                <h2 class="widget-category">${post.categories}</h2>
              </a>
              <a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">
                <p class="widget-topic">${post.title}</p>
              </a>
            </div>
          </a>
        </div>
        <div class="widget-bottom">
          <div class="icon">
            <a href="#"><span><i class="fas fa-user icon"></i> ${post.author?.username}</span></a>
            <a href="#"><span><i class="fas fa-comments icon"></i>${post.commentsCount || 0}</span></a>
            <a href="#"><span><i class="fas fa-clock icon"></i>${formatPostDate(new Date(post.createdAt))}</span></a>
          </div>
          <p class="widget-content">${post.content.slice(0, 150)}...</p>
          <a href="/api/posts/post/${post.slug}" class="read-more category-link" data-category="${post.categories}">Read More</a>
        </div>
      `;

      articleContainer.appendChild(widgetCard);
    });

  } catch (error) {
    console.error('Error loading education posts:', error);
  }
}

// Call the function to load Education posts on page load
document.addEventListener('DOMContentLoaded', () => {
  const category = 'Education'; // The category to load
  loadEducationPosts(category);
});


async function loadCategoriesPosts(categories) {
  try {
    // Fetch posts from the backend
    const response = await fetch('https://infohub-ffez.onrender.com/api/posts/homepage-posts');
    const data = await response.json();

    console.log('Fetched Home Page Data:', data);

    // Find the category data based on the category name
    const categoryData = data.find(item => item.categories === categories);
    console.log(`Category Data for ${categories}:`, categoryData);

    // If the category has no posts, hide the container
    if (!categoryData || categoryData.posts.length === 0) {
      document.querySelector(`.lifestyle-health-container[data-category="${categories}"]`).style.display = 'none';
      return;
    }

    // Get the major feed and secondary headlines holders
    const majorFeed = document.querySelector(`.lifestyle-major-feed[data-category="${categories}"]`);
    const secondaryHolder = document.querySelector(`.lifestyle-headline-holder[data-category="${categories}"]`);

    // Clear current content
    majorFeed.innerHTML = '';
    secondaryHolder.innerHTML = '';

    // Get the available posts, and if there are fewer than needed, repeat the posts to fill up
    const posts = categoryData.posts.length === 1 ? 
      [categoryData.posts[0], categoryData.posts[0], categoryData.posts[0]] : 
      categoryData.posts;

    // // Clone posts if needed to fill the placeholders
    // while (posts.length < 3) {
    //   posts.push(...categoryData.posts); // Clone available posts until we have at least 3
    // }

    // Render the major headline content (first post)
    const firstPost = posts[0];
    majorFeed.innerHTML = `
      <div class="first-category-topic headline lifestyle-major-headline">
          <a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="${firstPost.categories}"><img src="${firstPost.image || 'images/default-image.jpg'}" alt="${firstPost.title}"></a>
          <div class="lifestyle-major-headline-content">
              <a href="/posts?category=${firstPost.categories}"><h2>${firstPost.categories}</h2></a>
              <a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="${firstPost.categories}"><p>${firstPost.title}</p></a>
              <span>By <a href="#" class="author-link">${firstPost.author?.username || 'Unknown'}</a></span>
          </div>
      </div>
      <div class="lifestyle-major-content">
          <p>${firstPost.content.slice(0, 130)}... <span class="readmore-link"><a href="/api/posts/post/${firstPost.slug}" class="category-link" data-category="${firstPost.categories}">Read more</a></span></p>
          <div class="icon">
              <a href="#"><span><i class="fas fa-comments icon"></i>${firstPost.commentsCount || 0}</span></a>
              <a href="#"><span><i class="fas fa-clock icon"></i>${formatPostDate(new Date(firstPost.createdAt))}</span></a>
          </div>
      </div>
    `;

    // Render the secondary headlines (remaining posts)
    posts.slice(1, 4).forEach(post => {
      const secondaryPost = `
        <div class="lifestyle-category-topic headline lifestyle-minor-headline">
            <div class="lifestyle-headline-content">
                <a href="/posts?category=${post.categories}"><h2>${post.categories}</h2></a>
                <a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}"><p>${post.title}</p></a>
            </div>
        </div>
      `;
      secondaryHolder.innerHTML += secondaryPost;
    });
  } catch (error) {
    console.error('Error loading category posts:', error);
  }
}

// Call the function for the Politics category
document.addEventListener('DOMContentLoaded', () => {
  const politicsCategory = 'Politics'; // The category to load
  loadCategoriesPosts(politicsCategory);

  const healthCategory = 'Health'; // The health category to load
  loadCategoriesPosts(healthCategory);
});



document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://infohub-ffez.onrender.com/api/posts/layout');
    const { 
      recentPosts, 
      topPosts, 
      randomPosts, 
      yearlyPopular, 
      recentWithThumbs, 
      mostShared
    } = await response.json();

    // Clear and populate Week Trending section
    populateWeekTrending(recentPosts);

    // Clear and populate Recent with Thumbs section
    populateRecentWithThumbs(recentWithThumbs);

    // Populate Recent, Replies, and Random sections
    populateSection('recent', recentPosts, 'recent-news-link');
    populateSection('replies', topPosts, 'recent-news-link');
    populateSection('random', randomPosts, 'recent-news-link');

    // Populate Yearly Popular section
    populateYearlyPopular(yearlyPopular);

    // Populate Most Shared section
    populateMostShared(mostShared);
  } catch (error) {
    console.error('Error fetching post data:', error);
  }
});

// Utility function to populate Week Trending
function populateWeekTrending(posts) {
  const container = document.querySelector('.week-trending .news-trending');
  container.innerHTML = ''; // Clear initial content

  posts.forEach(post => {
    const link = document.createElement('a');
    link.href = `/api/posts/post/${post.slug}`;
    link.className = 'news-link';
    link.dataset.icon = 'fas fa-chevron-right';
    link.innerHTML = `
      ${post.title} <i style="color: #FF69B4; font-size:17px;" class="fas fa-chevron-right"></i>
    `;
    container.append(link);
  });
}

// Utility function to populate Recent with Thumbs
function populateRecentWithThumbs(posts) {
  const container = document.querySelector('.recent-with-thumbs .news-trending');
  container.innerHTML = ''; // Clear initial content

  posts.forEach(post => {
    const link = document.createElement('a');
    link.href = `/api/posts/post/${post.slug}`;
    link.className = 'news-link with-thumb';
    link.style.border = 'none';
    link.dataset.image = post.image;
    link.innerHTML = `
      <img src="${post.image}" alt="${post.title}">
      <span>${post.title}</span>
    `;
    container.append(link);
  });
}

// Utility function to populate Recent, Replies, and Random sections
function populateSection(sectionId, posts, className) {
  const section = document.getElementById(sectionId);
  section.innerHTML = ''; // Clear initial content

  posts.forEach(post => {
    const link = document.createElement('a');
    link.href = `/api/posts/post/${post.slug}`;
    link.className = className;
    link.style.border = 'none';
    link.innerHTML = `
      <span>${post.title} 
      <br>
      <span style="font-size: 11px;"><i class="fas fa-eye"></i>&nbsp;&nbsp;<span style="font-size: 11px;">${post.views}</span></span> <span style="font-size: 11px; margin-left: 10px;"><i class="fas fa-thumbs-up like-icon"></i>&nbsp;&nbsp;${post.reactions.love}</span></span>
      <i style="color: #FF69B4; font-size:17px;" class="fas fa-chevron-right"></i>
    `;
    section.append(link);
  });
}

// Utility function to populate Yearly Popular
function populateYearlyPopular(posts) {
  const container = document.querySelector('.yearly-popular-content');
  container.innerHTML = ''; // Clear initial content

  posts.forEach((post, index) => {
    const card = document.createElement('div');
    card.className = 'popular-article-card';
    card.innerHTML = `
      <div class="popular-article-headline topic">
        <img src="${post.image}" alt="${post.title}">
        <h2>${index + 1}</h2>
        <div class="popular-headline-info">
          
          <p><a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">${post.title}</a></p>
        </div>
      </div>
      <div class="popular-headline-brief">
        <p>${post.meta.description.substring(0, 100)}...<a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">Read more</a></p>
        <hr class="section-divider">
      </div>
    `;
    container.append(card);
  });
}

function populateMostShared(posts) {
  const container = document.querySelector('.most-shared-content'); // Reuse or create a new section
  container.innerHTML = ''; // Clear initial content

  posts.forEach((post, index) => {
    const card = document.createElement('div');
    card.className = 'popular-article-card';
    card.innerHTML = `
      <div class="popular-article-headline topic">
        <img src="${post.image}" alt="${post.title}">
        <h2>${index + 1}</h2>
        <div class="popular-headline-info">
          <p><a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">${post.title}</a></p>
        </div>
      </div>
      <div class="popular-headline-brief">
        <p>${post.meta.description.substring(0, 100)}...<a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">Read more</a></p>
        <hr class="section-divider">
      </div>
    `;
    container.append(card);
  });
}


// Function to set cookies
// Function to set cookies
// Function to set cookies
// function setPreferenceCookie(name, value, days) {
//   const date = new Date();
//   date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//   const expires = "expires=" + date.toUTCString();
//   document.cookie = name + "=" + value + "; " + expires + "; path=/";
//   // document.cookie = `${name}=${value};${expires};path=/`;
// }

// // Function to get cookies
// function getPreferenceCookie(name) {
//   const nameEQ = name + "=";
//   const cookies = document.cookie.split(';');
//   for (let i = 0; i < cookies.length; i++) {
//     let cookie = cookies[i].trim();
//     if (cookie.indexOf(nameEQ) === 0) {
//       return cookie.substring(nameEQ.length);
//     }
//   }
//   return null;
// }

// // Function to track category views
// function trackCategoryView(category) {
//   console.log("Tracking category view:", category);
//   let categoryViews = getPreferenceCookie("categoryViews");
//   categoryViews = categoryViews ? JSON.parse(categoryViews) : {};

//   // Increment or initialize the category view count
//   categoryViews[category] = (categoryViews[category] || 0) + 1;

//   console.log("Updated category views:", categoryViews);
//   setPreferenceCookie("categoryViews", JSON.stringify(categoryViews), 30); // Store for 30 days
// }

// // Add event listeners to track category views
// document.addEventListener("DOMContentLoaded", function (post) {
//   const categoryLinks = document.querySelectorAll(".category-link");

//   categoryLinks.forEach((link) => {
//     link.addEventListener("click", function (event) {
//       const category = this.getAttribute("data-category");
//       const targetURL = this.getAttribute("href");

//       if (category && targetURL) {
//         // Track category view
//         trackCategoryView(category);
//         window.location.href = targetURL;
//         event.preventDefault(); // Prevent default navigation for invalid URLs
//       } else {
//         console.warn("Category not found in data-category attribute for:", this);
//       }
//     });
//   });
// });


// Function to set cookies 
function setPreferenceCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

// Function to get cookies
function getPreferenceCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

// Function to track category views
function trackCategoryView(category) {
  console.log("Tracking category view:", category);
  let categoryViews = getPreferenceCookie("categoryViews");
  
  try {
    categoryViews = categoryViews ? JSON.parse(categoryViews) : {};
  } catch (error) {
    categoryViews = {}; // Reset if corrupted
  }

  categoryViews[category] = (categoryViews[category] || 0) + 1;

  console.log("Updated category views:", categoryViews);
  setPreferenceCookie("categoryViews", JSON.stringify(categoryViews), 30);
}

// Add event listeners to track category views
document.addEventListener("DOMContentLoaded", function () {
  console.log("Category tracking script loaded, waiting for links...");

  // Function to attach click listeners to category links
  function attachCategoryListeners() {
    const categoryLinks = document.querySelectorAll("a.category-link");
    if (categoryLinks.length === 0) {
      console.log("No category links found yet.");
      return;
    }

    console.log("Attaching event listeners to", categoryLinks.length, "links.");
    
    categoryLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        const category = this.getAttribute("data-category");
        const targetURL = this.getAttribute("href");

        if (category) {
          console.log("Tracking category:", category);
          trackCategoryView(category);
        } else {
          console.warn("Skipping element without data-category:", this);
        }

        if (targetURL) {
          event.preventDefault();
          setTimeout(() => {
            window.location.href = targetURL;
          }, 500);
        } else {
          console.warn("Target URL not found for:", this);
        }
      });
    });
  }

  // Use MutationObserver to watch for new elements
  const observer = new MutationObserver(() => {
    attachCategoryListeners(); // Attach listeners when new elements appear
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check in case elements are already there
  setTimeout(attachCategoryListeners, 1000);
});




// Fetch recommendations
const apiBaseUrl = window.location.hostname.includes("localhost") 
  ? "http://localhost:3173"
  : "https://infohub-ffez.onrender.com";

// Fetch recommendations
async function fetchRecommendations() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/cookie`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const recommendedPosts = await response.json();

    // Display recommended posts
    const recommendationsContainer = document.getElementById("recommendations");
    if (!recommendationsContainer) {
      console.error("Recommendations container not found!");
      return;
    }

    recommendationsContainer.innerHTML = "";

    // Create a single slide wrapper for all posts
    const slideWrapper = document.createElement("div");
    slideWrapper.classList.add("recommended-slides-wrapper");

    // Loop through all categories and aggregate posts
    recommendedPosts.forEach((category) => {
      category.posts.forEach((post, index) => {
        let sponsoredLabel = "";
        if (post.isSponsored) {
          sponsoredLabel = '<div class="sponsored-label"><i class="fas fa-bullhorn"></i>&nbsp; Sponsored</div>';
        }

        const categories = Array.isArray(post.categories)
          ? post.categories
              .map(
                (category) =>
                  `<a style="color: #6A0DAD;" class="post-label-a" href="/posts?category=${encodeURIComponent(
                    category
                  )}">${category}</a>`
              )
              .join(` <span><i class="fas fa-angle-right"></i></span> `)
          : "No Subcategories";

        const slide = `
          <div class="recommended-slide-item post-related-item">
            ${sponsoredLabel}
            <a class="thumbnail item-thumbnail optimized">
              <img loading="lazy" decoding="async" src="${post.image}" alt="Slide ${index + 1}">
            </a>
            
            <div class="recommended-content">
              <p>${categories}</p>
              <h2 class="item-title"><a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">${post.title}</a></h2>
            </div>
          </div>
        `;
        slideWrapper.innerHTML += slide;
      });
    });

    // Append the slide wrapper to the recommendations container
    recommendationsContainer.appendChild(slideWrapper);

    // Initialize sliding functionality
    initializeSlideshow(slideWrapper);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }
}

function initializeSlideshow(slideWrapper) {
  const slides = slideWrapper.querySelectorAll(".recommended-slide-item");
  let currentSlideIndex = 0;

  const isLargeScreen = window.innerWidth > 768;
  const slidesPerView = isLargeScreen ? 2 : 1;

  // Apply styles to show slides per view
  slideWrapper.style.display = "flex";
  slideWrapper.style.overflow = "hidden";
  slideWrapper.style.scrollBehavior = "smooth";
  slides.forEach((slide) => {
    slide.style.minWidth = `${100 / slidesPerView}%`;
  });

  // Create navigation buttons
  const prevButton = document.createElement("button");
  prevButton.classList.add("slide-nav", "prev");
  prevButton.innerHTML = "&#10094;"; // Unicode for left arrow
  prevButton.addEventListener("click", () => slide(-1, slideWrapper, slidesPerView));

  const nextButton = document.createElement("button");
  nextButton.classList.add("slide-nav", "next");
  nextButton.innerHTML = "&#10095;"; // Unicode for right arrow
  nextButton.addEventListener("click", () => slide(1, slideWrapper, slidesPerView));

  // Insert navigation buttons
  slideWrapper.parentElement.insertBefore(prevButton, slideWrapper);
  slideWrapper.parentElement.appendChild(nextButton);

  // Auto-slide every 3 seconds
  setInterval(() => slide(1, slideWrapper, slidesPerView), 3000);
}

function slide(direction, slideWrapper, slidesPerView) {
  const slideWidth = slideWrapper.offsetWidth / slidesPerView;
  const maxScroll = slideWrapper.scrollWidth - slideWrapper.offsetWidth;

  // Scroll left or right
  let newScrollLeft = slideWrapper.scrollLeft + direction * slideWidth;

  // Handle infinite scroll
  if (newScrollLeft >= maxScroll) {
    slideWrapper.scrollLeft = 0; // Reset to start
  } else if (newScrollLeft < 0) {
    slideWrapper.scrollLeft = maxScroll; // Go to the end
  } else {
    slideWrapper.scrollLeft = newScrollLeft;
  }
}

document.addEventListener("DOMContentLoaded", fetchRecommendations);
