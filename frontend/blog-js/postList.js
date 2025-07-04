

 
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


let currentPage = 1;
const postsPerPage = 5; // Show 5 posts initially per category
let totalPosts = 0;
let totalPages = 0;
let currentCategory = null; // Track current category for loading more

async function fetchPosts(category = null, trending = false, searchQuery = '', postType = null, subCategory = null, tag = null) {
  const spinner = document.getElementById("similar-content-spinner");
  const postsContainer = document.getElementById("postsContainer");

    // Show the spinner and hide the posts container initially
    spinner.classList.remove("spinner-hidden")
    spinner.classList.add("spinner-show")
  postsContainer.style.display = "none";

  let title = 'Latest Health News And Tips';
  let description = 'All News and Tips';

  if (trending) {
    title = 'Trending';
    description = 'View Trending Posts';
  } else if (searchQuery) {
    title = `Search Results for: "${searchQuery}"`;
    description = `Results for: "${searchQuery}"`;
  } else if (category) {
    title = category.charAt(0).toUpperCase() + category.slice(1);
    description = `All ${title} Blogs`;
  }

  if (subCategory) {
    title = `${subCategory}`;
    description = `Posts under ${subCategory}`;
  }

  if (tag) {
    title = `${tag}`;
    description = `Posts with tag: ${tag}`;
  }

  const categoryTitle = createAllBlogsHeader(title, description);
  postsContainer.innerHTML = ""; // Clear previous content
  postsContainer.appendChild(categoryTitle); // Add the category title

  document.title = `${title} - Blog`;

  try {
    const response = await fetch("https://agapelove-medlab-ms.onrender.com/api/posts");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Server error: " + data.message);
    }

    let filteredPosts = data; // Start with all posts

    // Filter logic
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (postType) {
      filteredPosts = filteredPosts.filter(post => post.type?.includes(postType));
    }

    if (subCategory) {
      filteredPosts = filteredPosts.filter(post => post.subCategories?.includes(subCategory));
    }

    if (tag) {
      filteredPosts = filteredPosts.filter(post => post.tags?.includes(tag));
    }

    let postsToShow = [];

    // Sorting for special categories
    if (trending) {
      postsToShow = filteredPosts
        .sort((a, b) => {
          const scoreA = a.views + Object.values(a.reactions || {}).reduce((sum, count) => sum + count, 0);
          const scoreB = b.views + Object.values(b.reactions || {}).reduce((sum, count) => sum + count, 0);
          return scoreB - scoreA;
        })
        .slice(0, 30);
    } else if (category === 'top-stories') {
      // Select posts with balanced engagement (views, reactions, comments)
      postsToShow = filteredPosts
        .filter(post => {
          const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
          const reactionsCount = Object.keys(post.reactions || {}).length;
          return post.views > 10 && commentsCount > 2 && reactionsCount > 2;
        })
        .sort((a, b) => {
          const commentsA = Array.isArray(a.comments) ? a.comments.length : 0;
          const commentsB = Array.isArray(b.comments) ? b.comments.length : 0;
          const reactionsA = Object.keys(a.reactions || {}).length;
          const reactionsB = Object.keys(b.reactions || {}).length;
          const engagementA = Math.min(a.views, commentsA, reactionsA);
          const engagementB = Math.min(b.views, commentsB, reactionsB);
          return engagementB - engagementA;
        })
        .slice(0, 20);

    } else if (category === 'latest-articles') {
      postsToShow = filteredPosts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 30);
    } else if (category === 'most-popular') {
      postsToShow = filteredPosts
        .sort((a, b) => {
          const scoreA = a.comments.length + a.views + Object.values(a.reactions || {}).reduce((sum, count) => sum + count, 0);
          const scoreB = b.comments.length + b.views + Object.values(b.reactions || {}).reduce((sum, count) => sum + count, 0);
          return scoreB - scoreA;
        })
        .slice(0, 15);
    } else if (category === 'special-reports') {
      postsToShow = filteredPosts
        .filter(post => post.comments.length > 0 || post.views > 0 || Object.values(post.reactions || {}).length > 0)
        .sort((a, b) => {
          const scoreA = a.comments.length + a.views + Object.values(a.reactions || {}).reduce((sum, count) => sum + count, 0);
          const scoreB = b.comments.length + b.views + Object.values(b.reactions || {}).reduce((sum, count) => sum + count, 0);
          return scoreB - scoreA;
        })
        .slice(0, 30);
    } else if (category) {
      filteredPosts = filteredPosts.filter(post =>
        post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
      );

      const topRecentPosts = filteredPosts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      const remainingPosts = filteredPosts
        .filter(post => !topRecentPosts.includes(post))
        .sort((a, b) => {
          const scoreA = a.views + a.comments.length + Object.values(a.reactions || {}).reduce((sum, count) => sum + count, 0);
          const scoreB = b.views + b.comments.length + Object.values(b.reactions || {}).reduce((sum, count) => sum + count, 0);
          return scoreB - scoreA;
        });

      postsToShow = [...topRecentPosts, ...remainingPosts];
    } else {
      postsToShow = filteredPosts;
    }

    // Group posts by categories
    const calculateCategoryScore = (posts) => {
      return posts.reduce((total, post) => {
        const score = post.views +
          (post.comments?.length || 0) +
          Object.values(post.reactions || {}).reduce((sum, count) => sum + count, 0);
        return total + score;
      }, 0);
    };

    // Updated logic to display categories in order of their popularity score
    const categories = [
      "Health News", "Health Tips", "Trending Topics"
    ];

    // Create an array of categories with their scores
    const categoryScores = categories.map(category => {
      const categoryPosts = filteredPosts.filter(post => post.categories.includes(category));
      return {
        name: category,
        score: calculateCategoryScore(categoryPosts),
        posts: categoryPosts
      };
    });

    // Sort categories by their scores in descending order
    const sortedCategories = categoryScores.sort((a, b) => b.score - a.score);

    // Display posts in the sorted category order
    sortedCategories.forEach(({ name, posts }) => {
      if (posts.length > 0) {
        const categoryContainer = createCategoryContainer(name, posts);
        postsContainer.appendChild(categoryContainer);
    
        // Add an advertisement container after each category container
        const adContainer = createAdvertisementContainer(name);
        postsContainer.appendChild(adContainer);
      }
    });
    


    // Show total posts count based on the filtered posts
    const totalPosts = postsToShow.length;
    // const totalPages = Math.ceil(totalPosts / postsPerPage);

    const totalPostsCountElement = document.getElementById("totalPostsCount");
    if (totalPostsCountElement) {
      totalPostsCountElement.textContent = `Posts: ${totalPosts}`;
    }

    // Clear `postsToShow` to avoid uncategorized appending
    postsToShow = [];

  } catch (error) {
    console.error("Error fetching posts:", error);
    postsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  } finally {
    // Hide the spinner and show the posts container
    spinner.classList.remove("spinner-show");
    spinner.classList.add("spinner-hidden");
    postsContainer.style.display = "block";
  }
}


// Create the category container with the load more feature
function createCategoryContainer(category, categoryPosts, postsPerPage = 5) {
  const categoryContainer = document.createElement("div");
  const shadowContainer = document.createElement("div");

  categoryContainer.id = `category-container-${category}`;
  categoryContainer.classList.add('category-container', 'category-link');
  categoryContainer.setAttribute("data-category", category);

  shadowContainer.className = "shadow-container";

  const categoryTitle = createCategoryTitle(category, `View all ${category} posts`);
  categoryContainer.appendChild(categoryTitle);

  const categoryPostsContainer = document.createElement("div");
  categoryPostsContainer.className = "category-posts";

  // Initially display the first 'postsPerPage' posts
  categoryPosts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by recency
    .slice(0, postsPerPage)
    .forEach(post => {
      const postElement = createPostElement(post);
      categoryPostsContainer.appendChild(postElement);
    });

  // Add a "Load More" button if there are more posts to display
  if (categoryPosts.length > postsPerPage) {
    const loadMoreBtn = createLoadMoreButton(category, categoryPosts, postsPerPage);
    categoryPostsContainer.appendChild(loadMoreBtn);

    // Ensure the shadow container is displayed
    shadowContainer.style.display = "block";
  } else {
    // Hide the shadow container if not enough posts
    shadowContainer.style.display = "none";
  }

  categoryContainer.appendChild(categoryPostsContainer);
  categoryContainer.appendChild(shadowContainer);

  return categoryContainer;
}


// Create the category title dynamically
function createAllBlogsHeader(title, description = '') {
  const categoryContainer = document.createElement('div');
  categoryContainer.className = "second-category-title header archive-page-header"; // "All Blogs" with query type header

  categoryContainer.innerHTML = `
      <a href="#" title="${title.toLowerCase()} category">
          <h2>
          <span>LABEL: </span>
          <strong>${title.toUpperCase()}</strong>
          </h2>
      </a>
      <a href="#">
          <p>${description} <span><i class="fas fa-eye icon"></i></span></p>
      </a>

      <div class="archive-page-pagination archive-page-pagination-top">
          <span id="totalPostsCount" class="total-posts"></span> <!-- Total post count -->
          <div class="clear"></div>
      </div>
  `;

  return categoryContainer;
}


function createCategoryTitle(title = '') {
  const categoryContainer = document.createElement('div');
  categoryContainer.className = "postlist-category-title"; // Regular category title

  categoryContainer.innerHTML = `
      <h2>${title}</h2>
  `;

  return categoryContainer;
}

// Create the post element for displaying
function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "col-12 mb-4"; // Full width on small screens

  const imageUrl = post.image ? `${post.image}` : 'default-image-path.jpg';
  const authorName = post.author ? post.author.fullName : 'Unknown Author';

  let sponsoredLabel = post.isSponsored
    ? '<div class="badge bg-warning text-dark position-absolute top-0 start-0 m-2"><i class="fas fa-bullhorn"></i> Sponsored</div>'
    : '';

  postElement.innerHTML = `
    <div class="card h-100 shadow-sm border-0">
      <div class="row g-0 align-items-center">
        <!-- Image on the left (on large screens) -->
        <div class="col-md-5 position-relative">
          ${sponsoredLabel}
          <a href="/api/posts/post/${post.slug}" class="d-block">
            <img src="${imageUrl}" class="img-fluid rounded-start w-100 h-100 object-fit-cover" alt="${post.title}" loading="lazy">
          </a>
        </div>
        
        <!-- Post content on the right -->
        <div class="col-md-7">
          <div class="card-body">
            <h5 class="card-title">
              <a href="/api/posts/post/${post.slug}" class="text-primary text-decoration-none">${post.title}</a>
            </h5>
            <div class="d-flex flex-wrap align-items-center text-muted small mb-2">
              <span class="me-3"><i class="fa-regular fa-user"></i> ${authorName}</span>
              <span class="me-3"><i class="fa-regular fa-eye"></i> ${post.views || 0}</span>
              <span class="me-3"><i class="fa-regular fa-comment"></i> ${Array.isArray(post.comments) ? post.comments.length : 0}</span>
              <span><i class="fa-regular fa-clock"></i> ${formatPostDate(new Date(post.createdAt))}</span>
            </div>
            <p class="card-text small">${post.content.slice(0, 120)}... 
              <a href="/api/posts/post/${post.slug}" class="text-decoration-none fw-bold text-primary">Read more</a>
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                ${["like", "love", "haha", "wow", "sad", "angry"].map(type =>
    `<span class="badge bg-light text-dark me-1">${getReactionIcon(type)} ${post.reactions?.[type] || 0}</span>`
  ).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return postElement;
}


// Create "Load More" button for each category
function createLoadMoreButton(category, posts, postsPerPage = 5) {
  const loadMoreButton = document.createElement("button");
  loadMoreButton.textContent = "Load More";
  loadMoreButton.className = "load-more-btn";

  let displayedPosts = postsPerPage; // Initial number of posts to display

  loadMoreButton.onclick = () => {
    const categoryContainer = document.querySelector(`#category-container-${category} .category-posts`);
    if (!categoryContainer) return;

    // Get remaining posts from the index of displayedPosts to the next set of posts
    const remainingPosts = posts.slice(displayedPosts, displayedPosts + postsPerPage);
    displayedPosts += remainingPosts.length;

    // Append the remaining posts
    remainingPosts.forEach(post => {
      const postElement = createPostElement(post); // Function to create a post card
      categoryContainer.appendChild(postElement);
    });

    // If no more posts to load, hide the button and show a message
    if (displayedPosts >= posts.length) {
      loadMoreButton.style.display = "none"; // Hide button
      const endMessage = document.createElement("p");
      endMessage.textContent = "That's all for this category.";
      endMessage.className = "end-message";
      categoryContainer.appendChild(endMessage);

      // Hide the shadow container when all posts are displayed
      const shadowContainer = document.querySelector(`#category-container-${category} .shadow-container`);
      if (shadowContainer) shadowContainer.style.display = "none";
    }
  };

  return loadMoreButton;
}

function createAdvertisementContainer(category) {
  const adContainer = document.createElement("div");
  adContainer.className = "advertisement-container";
  adContainer.setAttribute("data-category", category);

  let adScript = "";

  // Dynamically determine the ad network script based on the category
  if (category === "Chemistry") {
    adScript = `
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-XXXXXXXXXXXXXX"
           data-ad-slot="XXXXXXXXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    `;
  } else if (category === "Haematology") {
    adScript = `
      <script async src="https://cdn.adthrive.com/script.js"></script>
      <div id="adthrive-ad-container">
        <!-- AdThrive content will load dynamically -->
      </div>
    `;
  } else if (category === "Microbiology") {
    adScript = `
      <script async src="https://delivery.yieldmo.com/sdk.js"></script>
      <div id="yieldmo-ad-container">
        <!-- Yieldmo content will load dynamically -->
      </div>
    `;
  } else {
    adScript = `
      <script async src="https://www.media.net/dynamic/init.js"></script>
      <div id="media-net-ad-container">
        <!-- Media.net content will load dynamically -->
      </div>
    `;
  }

  // Populate the container with the ad content
  adContainer.innerHTML = `
    <div class="ad-placeholder">
      ${adScript}
    </div>
  `;

  return adContainer;
}




// // Utility function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// On page load, fetch posts based on the URL parameters (if any)
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const tag = urlParams.get('tag');
  const postType = urlParams.get('postType');
  const subCategory = urlParams.get('subCategory');
  const trending = urlParams.get('trending');

  let title = "Latest Health News And Tips"; // Default title

  if (trending) {
    title = 'Trending';
    fetchPosts(null, true); // Fetch trending posts
  } else if (category) {
    switch (category) {
      case 'top-stories':
        title = 'Top Stories';
        break;
      case 'latest-articles':
        title = 'Latest Articles';
        break;
      case 'most-popular':
        title = 'Most Popular';
        break;
      case 'special-reports':
        title = 'Special Reports';
        break;
      default:
        title = category.charAt(0).toUpperCase() + category.slice(1);
        description = `View all ${title} Blogs`;
    }
    fetchPosts(category); // Fetch posts based on category
  } else if (category) {
    fetchPosts(category); // Fetch posts for specific category
  } else if (tag) {
    title = `Posts with tag: ${tag}`;
    fetchPosts(null, false, tag); // Fetch posts based on tag
  } else if (postType) {
    title = `Posts of type: ${postType}`;
    fetchPosts(null, false, '', postType); // Fetch posts based on post type
  } else if (subCategory) {
    title = `Posts under: ${subCategory}`;
    fetchPosts(null, false, '', null, subCategory); // Fetch posts based on sub-category
  } else {
    fetchPosts(); // Default: Fetch all posts categorically
  }

  document.title = title; // Set the page title dynamically
};





// Function to get the Font Awesome icon based on reaction type
function getReactionIcon(type) {
  const icons = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡'
  };
  return icons[type] || '';
}