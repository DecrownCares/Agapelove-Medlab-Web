document.addEventListener("DOMContentLoaded", () => {
  displayUserInfo();
});

function displayUserInfo() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("userEmail");
  const role = localStorage.getItem("userRole");

  if (username && email && role) {
    document.getElementById("username").textContent = username;
    document.getElementById("userEmail").textContent = email; // Update email
    loadDashboard(role);
  } else {
    showNotification("User not logged in.");
    window.location.href = "index.html"; // Redirect to login if not logged in
  }
}


document.getElementById('edit-avatar-btn').addEventListener('click', () => {
  const gallery = document.getElementById('avatar-gallery');
  gallery.classList.toggle('avatar-gallery-hidden'); // Toggles the visibility of the gallery
});

// Handle avatar updates for Admins/Editors/Authors (File Upload)
document.getElementById('avatar-upload-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('https://infohub-ffez.onrender.com/api/user/upload-avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      showNotification('Avatar uploaded successfully!');
      const userData = await response.json();

      // Update Admin/Editor/Author's avatar in the UI
      document.getElementById('current-avatar').src =
        userData.avatar || './images/ImgUnavailable.jpeg';
    } else {
      showNotification('Failed to upload avatar.');
    }
  } catch (error) {
    console.error('Error uploading avatar:', error);
    showNotification('An error occurred while uploading the avatar.');
  }
});


document.getElementById('profile-update-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const token = localStorage.getItem('accessToken');

  try {
    for (let [key, value] of formData.entries()) {
      if (!value.trim()) continue; // Skip empty fields

      // Handle nested fields for socialMediaHandles
      const [mainField, subField] = key.split('.');
      const body = subField
        ? { field: mainField, subField, value } // For nested fields
        : { field: key, value }; // For non-nested fields

      const response = await fetch('https://infohub-ffez.onrender.com/api/user/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${key}`);
      }

      const result = await response.json();
      showNotification(result.message);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showNotification('Failed to update profile');
  }
});




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
          userData.avatar || './images/avatar.webp';
        document.getElementById('readerName').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
      } else if (userData.type === 'Admin' || userData.type === 'Editor' || userData.type === 'Author') {
        document.getElementById('current-avatar').src =
          userData.avatar || './images/ImgUnavailable.jpeg';
      }

    } else {
      console.error('Failed to fetch user profile:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
}

fetchUserProfile();


updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const platform = document.getElementById('platform').value;
  const count = parseInt(document.getElementById('count').value, 10); // Parse count as a number
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch('https://infohub-ffez.onrender.com/api/social/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      credentials: 'include',
      body: JSON.stringify({ platform, count }),
    });

    if (response.ok) {
      showNotification('Metric updated successfully!');
      updateForm.reset();  // Clear form after submission
    } else {
      const errorData = await response.json();
      showNotification(`Failed to update metric: ${errorData.error}`);
    }
  } catch (error) {
    showNotification('An error occurred while updating the metric.');
    console.error('Error updating metric:', error);
  }
});



function loadDashboard(role) {
  const dashboardContent = document.getElementById("dashboardContent");
  dashboardContent.innerHTML = ""; // Clear existing content

  if (role === "Admin") {
    dashboardContent.innerHTML = `
            <h2>Admin Dashboard</h2>
           <button onclick="openUserManagement()">Manage Users</button>
           <button onclick="openManagementPanel()">Manage Posts</button>
            <button onclick="createPost()">Create New Post</button>
            <button onclick="openSiteManagement()">Site Metrics</button>
        `;
  } else if (role === "Editor") {
    dashboardContent.innerHTML = `
            <h2>Editor Dashboard</h2>
            <button onclick="openManagementPanel()">Manage Posts</button>
            <button onclick="createPost()">Create New Post</button>
        `;
  } else if (role === "Author") {
    dashboardContent.innerHTML = `
            <h2>Author Dashboard</h2>
            <button onclick="createPost()">Create New Post</button>
            <button onclick="viewMyPosts()">View My Posts</button>
        `;
  } else {
    dashboardContent.innerHTML = "<h2>Unauthorized Role</h2>";
  }
}


function openManagementPanel() {
  document.getElementById('managementPanelOverlay').style.display = 'block';
}

function closeManagementPanel() {
  document.getElementById('managementPanelOverlay').style.display = 'none';
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


// Font configuration
const Font = Quill.import('formats/font');
Font.whitelist = [
  'sans-serif', 'serif', 'monospace', 'Trebuchet MS', 'Lucida Sans Unicode',
  'Lucida Grande', 'Lucida Sans', 'Arial'
];
Quill.register(Font, true);

// Font size configuration
const Size = Quill.import('formats/size');
Size.whitelist = ['small', 'normal', 'large', 'huge'];
Quill.register(Size, true);

// Text alignment configuration
const Align = Quill.import('formats/align');
Align.whitelist = ['left', 'center', 'right', 'justify'];
Quill.register(Align, true);

// Editor instances
let postQuill = null;
let promotionQuill = null;

// Configuration for the Quill editor
const quillConfig = {
  theme: 'snow',
  modules: {
    clipboard: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ size: ['small', 'normal', 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
      ['code-block']
    ]
  }
};

// Initialize Post Editor
function initializePostEditor() {
  if (!postQuill) {
    postQuill = new Quill('#postContent', quillConfig);

    // Add event listeners for image handling
    postQuill.on('text-change', handleImageStyling);
    postQuill.root.addEventListener('click', handleImageSelection);
  } else {
    console.log("postQuill already initialized");
  }
}

// Initialize Promotion Editor
function initializePromotionEditor() {
  if (!promotionQuill) {
    promotionQuill = new Quill('#promotionContent', quillConfig);

    // Add event listeners for image handling
    promotionQuill.on('text-change', handleImageStyling);
    promotionQuill.root.addEventListener('click', handleImageSelection);
  }
}

// Handle image styling
function handleImageStyling(delta, oldDelta, source) {
  if (source === 'user') {
    const images = document.querySelectorAll('.ql-editor img');
    images.forEach((img) => {
      if (!img.classList.contains('promotion-image') && !img.classList.contains('content-image')) {
        if (promotionQuill && img.closest('#promotionContent')) {
          // For images in the promotion editor, add the promotion-image class
          img.classList.add('promotion-image');
        } else if (postQuill && img.closest('#postContent')) {
          // For images in the post editor, add the content-image class
          img.classList.add('content-image');
        }
      }
    });
  }
}


// Handle image selection
function handleImageSelection(event) {
  if (event.target.tagName === 'IMG') {
    document.querySelectorAll('.ql-editor img').forEach(img => img.classList.remove('selected'));
    event.target.classList.add('selected');
  }
}

// Switch between panels
function showPanel(panel) {
  const postPanel = document.getElementById('postFormPanel');
  const promotionPanel = document.getElementById('promotionFormPanel');

  postPanel.style.display = 'none';
  promotionPanel.style.display = 'none';

  if (panel === 'post') {
    postPanel.style.display = 'block';
    initializePostEditor();
  } else if (panel === 'promotion') {
    promotionPanel.style.display = 'block';
    initializePromotionEditor();
  }
}

// Image alignment function
function alignImage(alignDirection, quillInstance) {
  const img = document.querySelector('.ql-editor img.selected');
  if (img) {
    img.classList.remove('float-left', 'float-right', 'float-center', 'float-promo-center');
    if (alignDirection === 'left') {
      img.classList.add('float-left');
    } else if (alignDirection === 'right') {
      img.classList.add('float-right');
    } else if (alignDirection === 'center') {
      img.classList.remove('content-image', 'float-left', 'float-right',);
      img.classList.add('float-center');
    } else if (alignDirection === 'promo-center') {
      img.classList.remove('promotion-image', 'float-left', 'float-right');
      img.classList.add('float-promo-center');
    }
  }
}

// Alignment buttons for promotion
document.querySelector('#alignLeftPromoButton').addEventListener('click', () => {
  alignImage('left', promotionQuill);
});

document.querySelector('#alignCenterPromoButton').addEventListener('click', () => {
  alignImage('promo-center', promotionQuill);
});

document.querySelector('#alignRightPromoButton').addEventListener('click', () => {
  alignImage('right', promotionQuill);
});


// Alignment buttons for postQuill
document.querySelector('#alignLeftButton').addEventListener('click', () => {
  alignImage('left', postQuill);
});

document.querySelector('#alignCenterButton').addEventListener('click', () => {

  alignImage('center', postQuill);
});

document.querySelector('#alignRightButton').addEventListener('click', () => {
  alignImage('right', postQuill);
});

// Logic to select the clicked image
document.querySelector('.ql-editor').addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    document.querySelectorAll('.ql-editor img').forEach(img => img.classList.remove('selected'));
    e.target.classList.add('selected');
  }
});



let currentPage = 1;
const postsPerPage = 10;
let posts = []; // Array to store all fetched posts

// Show Skeleton Loader
function showSkeletonLoader() {
  document.getElementById('skeletonLoader').classList.remove('hidden');
}

// Hide Skeleton Loader
function hideLoading() {
  document.getElementById('skeletonLoader').classList.add('hidden');
}

// Fetch Posts with Loading Indicator
async function fetchPostsWithLoading(category = null, trending = false, searchQuery = '', postType = null, subCategory = null) {
  const postList = document.getElementById('postsContainer');

  showSkeletonLoader(); // Show loading spinner while fetching posts

  postList.style.display = 'none'

  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  if (!token) {
    showNotification('You must be logged in to update the post');
    return;
  }

  try {
    const response = await fetch("https://infohub-ffez.onrender.com/api/post/admin-posts", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Server error: " + data.message);
    }

    posts = data; // Store fetched posts
    displayPosts(); // Display the posts

    countPostsByStatusAndCategory(posts);

    hideLoading(); // Hide loading spinner after posts are fetched

    postList.style.display = 'block'
  } catch (error) {
    console.error("Error fetching posts:", error);
    hideLoading();
  }
}

// Display posts with pagination
function displayPosts() {
  const postList = document.getElementById('postList');
  postList.innerHTML = ''; // Clear existing posts

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(0, endIndex); // Display posts up to the current page

  currentPosts.forEach(post => {
    const postItem = document.createElement('li');
    postItem.className = 'post-item';
    postItem.innerHTML = `
            <input type="checkbox" class="post-checkbox" data-id="${post._id}">
            <div class="admin-post-info">
                <h4 contenteditable="false" class="post-title" id="title-${post._id}">${post.title.slice(0, 60)}....</h4>
                
                <div class="post-analytics">
                    <span><i class="fa-regular fa-eye fa-lg fa-light"></i> ${post.views}</span>
                    <span><i class="fa-regular fa-user fa-lg fa-light"></i> ${post.author ? post.author.username : "Unknown author"}</span>
                    <span><i class="fa-regular fa-comment fa-flip fa-lg fa-light"></i> ${Array.isArray(post.comments) ? post.comments.length : 0}</span>
                    <span><i class="fa-regular fa-clock fa-lg fa-light"></i></i> <span class="post-meta-detail">${formatPostDate(new Date(post.createdAt))}</span></span>
                </div>
            </div>
            <select class="post-status" data-id="${post._id}" onchange="updatePostStatus('${post._id}', this.value)">
                <option value="Draft" ${post.status === 'Draft' ? 'selected' : ''}>Draft</option>
                <option value="Published" ${post.status === 'Published' ? 'selected' : ''}>Published</option>
                <option value="Archived" ${post.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
            <div class="post-actions">
            <button onclick="openEditModal('${post.slug}')">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="openCommentList('${post._id}')">
              <i class="fas fa-comments"></i>
            </button>
            <button onclick="openPreviewModal('${post.slug}')">
              <i class="fas fa-eye"></i>
            </button>
            <button onclick="deletePost('${post.slug}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        `;
    postList.appendChild(postItem);
  });

  // Hide "Load More" button if all posts are displayed
  if (endIndex >= posts.length) {
    document.getElementById('loadMoreButton').style.display = 'none';
  } else {
    document.getElementById('loadMoreButton').style.display = 'block';
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Function to load more posts
function loadMorePosts() {
  currentPage++;
  displayPosts(); // Display additional posts
}

// Handle post filtering by search query
function filterPosts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  if (!query) {
    displayPosts();
    return;
  }
  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query));
  displayFilteredPosts(filteredPosts);
}

// Function to display filtered posts
function displayFilteredPosts(filteredPosts) {
  const postList = document.getElementById('postList');
  postList.innerHTML = ''; // Clear existing posts
  filteredPosts.forEach(post => {
    const postItem = document.createElement('li');
    postItem.className = 'post-item';
    postItem.innerHTML = `
            <input type="checkbox" class="post-checkbox" data-id="${post._id}">
            <div class="post-info">
                <h4 contenteditable="false" class="post-title" id="title-${post._id}">${post.title}</h4>
                <div class="post-analytics">
                    <span>Views: ${post.views}</span>
                    <span>Reactions: ${post.reactions}</span>
                    <span>Comments: ${post.comments}</span>
                </div>
            </div>
            <select class="post-status" data-id="${post._id}" onchange="updatePostStatus(${post._id}, this.value)">
                <option value="Draft" ${post.status === 'Draft' ? 'selected' : ''}>Draft</option>
                <option value="Published" ${post.status === 'Published' ? 'selected' : ''}>Published</option>
                <option value="Archived" ${post.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
            <div class="post-actions">
            <button onclick="openEditModal(post.id)">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="archivePost('${post._id}')" id="archive-${post._d}" disabled>
                <i class="fas fa-archive"></i>
            </button>
            <button onclick="openPreviewModal('${post.slug}')">
              <i class="fas fa-eye"></i>
            </button>
            <button onclick="deletePost('${post.slug}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        `;
    postList.appendChild(postItem);
  });
}

// Function for sorting posts based on selected option
function sortPosts() {
  const sortOption = document.getElementById('sortOptions').value;
  posts.sort((a, b) => {
    if (sortOption === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOption === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'views') {
      return b.views - a.views;
    }
  });
  displayPosts();
}

function getSelectedPostIds() {
  const checkboxes = document.querySelectorAll('.post-checkbox:checked');
  return Array.from(checkboxes).map(checkbox => parseInt(checkbox.getAttribute('data-id')));
}

let currentPostId = null;

function enableSaveButton() {
  const saveButton = document.getElementById('savePostButton');
  saveButton.disabled = false;
}

function openEditModal(postSlug) {
  document.getElementById('savePostButton').disabled = false;
  console.log('Save button disabled:', document.getElementById('savePostButton').disabled);

  currentPostId = postSlug;  // Store postSlug globally
  console.log("currentPostId set to:", currentPostId);

  initializePostEditor();

  fetch(`https://infohub-ffez.onrender.com/api/posts/${postSlug}`)  // Use postSlug in the URL
    .then(response => {
      if (!response.ok) {
        throw new Error(`Post with slug ${postSlug} not found`);
      }
      return response.json();
    })
    .then(post => {
      console.log("Fetched post data:", post);
      // Proceed with the modal setup if post is found
      document.getElementById('edit-post-image').src = post.image ? `https://infohub-ffez.onrender.com${post.image}` : 'default-image-path.jpg';
      document.getElementById('postTitle').value = post.title;
      if (postQuill) {
        const delta = postQuill.clipboard.convert(post.content);
        postQuill.setContents(delta); // Use `setContents` instead of manipulating innerHTML
      } else {
        console.error("postQuill is not initialized!");
      }
      document.getElementById('postTags').value = post.tags.join(', ');
      document.getElementById('postType').innerText = post.types.join(", ");
      document.getElementById('category').innerText = post.categories.join(", ");
      document.getElementById('subCategory').innerHTML = post.subCategories.map(sub => `<a>${sub}</a>`).join(' <span><i class="fas fa-angle-right"></i></span> ');

      // Open the modal
      document.getElementById('editPostModal').style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching post data:', error);
      showNotification('Error fetching post data: ' + error.message); // Show an showNotification with error details
    });
}


// Save the post
function savePost() {
  console.log('Saving Post');
  
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  if (!token) {
    showNotification('You must be logged in to update the post');
    return;
  }

  const title = document.getElementById("postTitle").value;
  const content = postQuill ? postQuill.root.innerHTML : '';
  if (!content.trim()) {
    showNotification('Post content cannot be empty');
    return;
  }
  const category = document.getElementById("category").value;
  const subCategory = document.getElementById("subCategory").value;
  const postType = document.getElementById("postType").value;
  if (!postType) {
    console.error('Post type is empty or undefined');
  }
  const tags = document.getElementById("postTags").value.split(",").map(tag => tag.trim());
  const image = document.getElementById("imageInput").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("categories", category);
  formData.append("subCategories", JSON.stringify(subCategory));
  formData.append("types", postType);
  formData.append("tags", JSON.stringify(tags));

  if (image) {
    formData.append("image", image); // Ensure the input field is named 'image'
  }

  // Debug the form data
  for (let [key, value] of formData.entries()) {
    console.log(key, value); // Log each form field and its value
  }

  fetch(`https://infohub-ffez.onrender.com/api/post/${currentPostId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}` // Include the token in the headers
    },
    credentials: 'include',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        console.error('Failed with status:', response.status);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();  // Proceed only if the status is OK (200-299)
    })
    .then(updatedPost => {
      showNotification('Post updated successfully');
      closeEditModal();
      fetchPostsWithLoading();  // Optionally update the UI
    })
    .catch(error => {
      console.error('Error updating post:', error);
      showNotification(`Failed to update post: ${error.message}`);
    });
};


// Close the modal
function closeEditModal() {
  document.getElementById('editPostModal').style.display = 'none';
  // Optionally clear form fields
  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';
  document.getElementById('postTags').value = '';
  document.getElementById('imageInput').value = '';
}

// Preview the image
function previewImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById('edit-post-image').src = reader.result;
  };
  reader.readAsDataURL(file);
}

// Add event listeners to the fields to enable the save button
document.getElementById('postTitle').addEventListener('input', enableSaveButton);
document.getElementById('postContent').addEventListener('input', enableSaveButton);
document.getElementById('postTags').addEventListener('input', enableSaveButton);


// Placeholder function to view the post (could redirect to a view page)
function viewPost(postId) {
  showNotification(`Viewing post ID: ${postId}`);
  // Logic to view the post could be added here (e.g., opening a new page)
}


async function updatePostStatus(postId, newStatus) {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  if (!token) {
    showNotification('You must be logged in to update the post');
    return;
  }
  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/${postId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      const result = await response.json();
      showNotification('Post status updated successfully.', 'success');

      // Optionally refresh the post display or update the UI dynamically
      // e.g., update the display to show the "Published at" date if changed to published
      if (newStatus === 'published' && !result.post.publishedAt) {
        document.getElementById(`post-${postId}`).querySelector('.post-date').innerText =
          `Published at: ${new Date(result.post.publishedAt).toLocaleString()}`;
      }
    } else {
      showNotification('Failed to update post status.', 'error');
    }
  } catch (error) {
    console.error('Error updating post status:', error);
    showNotification('An error occurred while updating the post status.', 'error');
  }
}


// Delete a single post
async function deletePost(postSlug) {

  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  if (!token) {
    showNotification('You must be logged in to update the post');
    return;
  }

  if (confirm('Are you sure you want to delete this post?')) {
    try {
      // Send delete request to the server
      const response = await fetch(`https://infohub-ffez.onrender.com/api/post/${postSlug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('Post deleted successfully.');
        displayPosts(); // Refresh the post list
      } else {
        const data = await response.json();
        showNotification(`Error: ${data.message}`);
      }
    } catch (error) {
      showNotification('An error occurred while deleting the post.');
    }
  }
}

// Bulk delete selected posts
async function bulkDeletePosts() {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  if (!token) {
    showNotification('You must be logged in to update the post');
    return;
  }
  const selectedPostIds = getSelectedPostIds();
  if (selectedPostIds.length === 0) {
    showNotification('No posts selected.', 'error');
    return;
  }

  if (confirm('Are you sure you want to delete the selected posts?')) {
    try {
      const response = await fetch('https://infohub-ffez.onrender.com/api/post/posts/bulk-delete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ postIds: selectedPostIds })
      });

      if (response.ok) {
        showNotification('Selected posts have been deleted successfully.', 'success');
        displayPosts(); // Refresh the post list
      } else {
        const data = await response.json();
        showNotification(`Error: ${data.message}`, 'error');
      }
    } catch (error) {
      showNotification('An error occurred while deleting posts.', 'error');
    }
  }
}

// Bulk archive selected posts
async function bulkArchivePosts() {
  const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

  if (!token) {
    showNotification('You must be logged in to update the post');
    return;
  }
  const selectedPostIds = getSelectedPostIds();
  if (selectedPostIds.length === 0) {
    showNotification('No posts selected.', 'error');
    return;
  }

  if (confirm('Are you sure you want to archive the selected posts?')) {
    try {
      const response = await fetch('https://infohub-ffez.onrender.com/api/post/posts/bulk-archive', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ postIds: selectedPostIds })
      });

      if (response.ok) {
        showNotification('Selected posts have been archived successfully.', 'success');
        displayPosts(); // Refresh the post list
      } else {
        const data = await response.json();
        showNotification(`Error: ${data.message}`, 'error');
      }
    } catch (error) {
      showNotification('An error occurred while archiving posts.', 'error');
    }
  }
}


function viewPost(postId) {
  const modal = document.getElementById("postModal");
  const iframe = document.getElementById("postIframe");
  iframe.src = `previewPost.html?id=${postId}`;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("postModal");
  modal.style.display = "none";
  const iframe = document.getElementById("postIframe");
  iframe.src = ""; // Reset iframe to avoid reloading issues
}

window.onclick = function (event) {
  const modal = document.getElementById("postModal");
  if (event.target === modal) {
    closeModal();
  }
};


// Utility function to display notification messages
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification-container ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Utility function to get selected post IDs
function getSelectedPostIds() {
  return Array.from(document.querySelectorAll('.post-checkbox:checked'))
    .map(checkbox => checkbox.getAttribute('data-id'));
}

// Function to dismiss notification (optional)
function dismissNotification() {
  const notificationContainer = document.getElementById('notificationContainer');
  notificationContainer.classList.add('hidden');
}


function countPostsByStatusAndCategory(posts) {
  const categories = ["Technology", "Sports", "Entertainment", "Science", "Health", "Lifestyle", "Education", "Romance", "Politics", "Business", "Travel", "Fashion"];
  const counts = {
    totalPublished: 0,
    totalDraft: 0,
    totalArchived: 0,
    categories: {}
  };

  // Initialize category breakdown
  categories.forEach(categories => {
    counts.categories[categories] = {
      published: 0,
      draft: 0,
      archived: 0
    };
  });

  // Count posts based on status and category
  posts.forEach(post => {
    if (post.status === 'Published') {
      counts.totalPublished++;
      if (counts.categories[post.categories]) {
        counts.categories[post.categories].published++;
      }
    } else if (post.status === 'Draft') {
      counts.totalDraft++;
      if (counts.categories[post.categories]) {
        counts.categories[post.categories].draft++;
      }
    } else if (post.status === 'Archived') {
      counts.totalArchived++;
      if (counts.categories[post.categories]) {
        counts.categories[post.categories].archived++;
      }
    }
  });

  displayPostCounts(counts);

}

function displayPostCounts(counts) {
  document.getElementById('totalPublishedCount').textContent = counts.totalPublished;
  document.getElementById('totalDraftCount').textContent = counts.totalDraft;
  document.getElementById('totalArchivedCount').textContent = counts.totalArchived;

  const categoryCountsBody = document.getElementById('categoryCountsBody');
  categoryCountsBody.innerHTML = ''; // Clear existing rows

  for (const categories in counts.categories) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${categories}</td>
      <td>${counts.categories[categories].published}</td>
      <td>${counts.categories[categories].draft}</td>
      <td>${counts.categories[categories].archived}</td>
    `;
    categoryCountsBody.appendChild(row);
  }
}

// Toggle table visibility
document.getElementById('toggleCategoryTableButton').addEventListener('click', () => {
  const table = document.getElementById('categoryCountsTable');
  const postList = document.getElementById('postsContainer');

  if (table.style.display === 'none' || table.style.display === '') {
    table.style.display = 'table'; // Show the table
    postList.style.display = 'none'; // Hide the postList
  } else {
    table.style.display = 'none'; // Hide the table
    postList.style.display = 'block'; // Show the postList
  }
});


async function openCommentList(postId) {
  const postList = document.getElementById('postsContainer');
  const commentContainer = document.getElementById('commentContainer');
  const categoryCount = document.getElementById('categoryCountsContainer');
  showSkeletonLoader(),

    // Hide the post list
    categoryCount.style.display = 'none';
  postList.style.display = 'none';

  try {
    // Fetch the selected post's comments
    const response = await fetch(`https://infohub-ffez.onrender.com/api/comments/${postId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const data = await response.json();
    hideLoading();

    categoryCount.style.display = 'block';
    if (!response.ok) {
      throw new Error("Error fetching comments: " + data.message);
    }

    // Show the comments in the commentContainer
    commentContainer.innerHTML = ''; // Clear any previous comments
    data.comments.forEach(comment => {
      const commentItem = document.createElement('div');
      commentItem.className = 'comment-item';
      commentItem.innerHTML = `
        <div class="comment-content">
         <span class="comment-author">${comment.author.username}</span>
          <p>${comment.content}</p>
        </div>
        <div class="comment-reactions">
          <span>👍 ${comment.reactions.like}</span>
          <span>❤️ ${comment.reactions.love}</span>
          <span>😂 ${comment.reactions.haha}</span>
          <span>😲 ${comment.reactions.wow}</span>
          <span>😢 ${comment.reactions.sad}</span>
          <span>😡 ${comment.reactions.angry}</span>
        </div>
        <button onclick="deleteComment('${comment._id}', '${postId}')">Delete</button>

      `;
      commentContainer.appendChild(commentItem);
    });

    // Show the comment container
    commentContainer.style.display = 'block';

  } catch (error) {
    console.error("Error:", error);
    // Handle error (e.g., show an error message)
  }
}



async function deleteComment(commentId, postId) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    showNotification('You must be logged in to delete comments');
    return;
  }

  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();
    if (response.ok) {
      // Remove the comment from the UI
      const commentItem = document.getElementById(commentId);
      commentItem.remove();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    showNotification('Failed to delete comment');
  }
}


function goBackToPostList() {
  const postList = document.getElementById('postList');
  const commentContainer = document.getElementById('commentContainer');

  // Show the post list
  postList.style.display = 'block';

  // Hide the comment container
  commentContainer.style.display = 'none';

  fetchPostsWithLoading();
}





// Bulk action handler for delete/archive
// async function performBulkActions(action) {
//     try {
//         const selectedPosts = getSelectedPosts(); // Get all selected posts
//         if (selectedPosts.length === 0) {
//             showNotification('error', 'No posts selected.');
//             return;
//         }

//         let actionMessage = '';
//         if (action === 'delete') {
//             actionMessage = 'Deleting posts...';
//             await deletePosts(selectedPosts); // Simulate the delete request
//             showNotification('success', 'Selected posts deleted.');
//         } else if (action === 'archive') {
//             actionMessage = 'Archiving posts...';
//             await archivePosts(selectedPosts); // Simulate the archive request
//             showNotification('success', 'Selected posts archived.');
//         }
//     } catch (error) {
//         showNotification('error', 'An error occurred while performing the action.');
//     }
// }


function goToDashboard() {
  // Logic to switch the view to the dashboard
  console.log("Navigating to the dashboard...");
  // Add UI change or navigation logic here
}

function openPostManagement() {
  // Logic to switch the view to the post management panel
  console.log("Opening post management...");
  // Add UI change or navigation logic here
}

// document.addEventListener('DOMContentLoaded', displayPosts);
document.addEventListener("DOMContentLoaded", fetchPostsWithLoading);

let currentUserPage = 1;
const usersPerPage = 10;
let users = [];

async function openUserManagement() {
  document.getElementById('userModalOverlay').style.display = 'block';
  await fetchUsers();
}

function closeUserManagement() {
  document.getElementById('userModalOverlay').style.display = 'none';
}

// Fetch users from the server
async function fetchUsers() {
  const token = localStorage.getItem('accessToken'); // Retrieve the token

  if (!token) {
    showNotification('You must be logged in to access this page', 'error');
    return;
  }
  try {
    const response = await fetch('https://infohub-ffez.onrender.com/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to fetch user data');

    const data = await response.json();


    users = data
    // Sort the users by username in ascending order
    users.sort((a, b) => a.username.localeCompare(b.username));

    // Update the user count display
    updateUserCounts(users);

    // Render the user table
    renderUserTable(users);
  } catch (error) {
    showNotification('An error occurred while fetching users.', 'error');
  }
}

function updateUserCounts(users) {
  const totalUsers = users.length;
  const adminCount = users.filter(user => user.type === 'Admin').length;
  const editorCount = users.filter(user => user.type === 'Editor').length;
  const readerCount = users.filter(user => user.type === 'Reader').length;

  // Update the counts in the UI
  document.getElementById('totalUsersCount').textContent = totalUsers;
  document.getElementById('adminCount').textContent = adminCount;
  document.getElementById('editorCount').textContent = editorCount;
  document.getElementById('readerCount').textContent = readerCount;
}

// Render the user table with data
function renderUserTable(users) {
  const tableBody = document.getElementById('userTableBody');
  tableBody.innerHTML = ''; // Clear existing content

  const startIndex = (currentUserPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(0, endIndex); // Display posts up to the current page

  currentUsers.forEach(user => {
    const row = `
      <tr>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.type}</td>
        <td>${new Date(user.lastLogin).toLocaleDateString()}</td>
        <td>${user.isActive ? 'Active' : 'Inactive'}</td>
        <td>
          <select class="post-status" data-id="${user.username}" onchange="updateUserRole('${user.username}', this.value)">
                <option value="Admin" ${user.type === 'Admin' ? 'selected' : ''}>Admin</option>
                <option value="Editor" ${user.type === 'Editor' ? 'selected' : ''}>Editor</option>
                <option value="Reader" ${user.type === 'Reader' ? 'selected' : ''}>Reader</option>
          </select>
        </td>
        <td>
          <select class="post-status" data-id="${user._id}" onchange="updateUserStatus(${user._id}, this.value)">
                <option value="Activated" ${user.isBlocked === true ? 'selected' : ''}>Activated</option>
                <option value="Deactivated" ${user.isBlocked === false ? 'selected' : ''}>Deactivated</option>
          </select>
        </td>
        <td>
          <button class="user-action-btn" onclick="editUser('${user._id}')"><i class="fas fa-edit"></i></button>
          <button class="user-close-btn" onclick="deleteUser('${user._id}')"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
  // Hide "Load More" button if all posts are displayed
  if (endIndex >= users.length) {
    document.getElementById('loadMoreUserButton').style.display = 'none';
  } else {
    document.getElementById('loadMoreUserButton').style.display = 'block';
  }
};

// Function to load more posts
function loadMoreUsers(users) {
  currentUserPage++;
  renderUserTable(users); // Display additional users
}


function filterUsers(users) {
  const query = document.getElementById('userSearchInput').value.toLowerCase();

  // If the query is empty, render the full user list
  if (!query) {
    renderUserTable(users);
    return;
  }

  // Filter the users based on the query
  const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))

  // Render the filtered list
  renderFilteredUsers(filteredUsers);
}



function renderFilteredUsers(users) {
  const tableBody = document.getElementById('userTableBody');
  tableBody.innerHTML = ''; // Clear existing content

  users.forEach(user => {
    const row = `
      <tr>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.type}</td>
        <td>${new Date(user.lastLogin).toLocaleDateString()}</td>
        <td>${user.isActive ? 'Active' : 'Inactive'}</td>
        <td>
          <select class="post-status" data-id="${user.username}" onchange="updateUserRole('${user.username}', this.value)">
                <option value="Admin" ${user.type === 'Admin' ? 'selected' : ''}>Admin</option>
                <option value="Editor" ${user.type === 'Editor' ? 'selected' : ''}>Editor</option>
                <option value="Reader" ${user.type === 'Reader' ? 'selected' : ''}>Reader</option>
          </select>
        </td>
        <td>
          <select class="post-status" data-id="${user._id}" onchange="updateUserStatus(${user._id}, this.value)">
                <option value="Activated" ${user.isBlocked === true ? 'selected' : ''}>Activated</option>
                <option value="Deactivated" ${user.isBlocked === false ? 'selected' : ''}>Deactivated</option>
          </select>
        </td>
        <td>
          <button class="user-action-btn" onclick="editUser('${user._id}')"><i class="fas fa-edit"></i></button>
          <button class="user-close-btn" onclick="deleteUser('${user._id}')"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}


function sortUsers(users) {
  const roleFilter = document.getElementById('roleFilter').value;

  users.sort((a, b) => {
    if (roleFilter === 'Admin' || roleFilter === 'Editor' || roleFilter === 'Reader') {
      // Filter users by their type and sort alphabetically by their name
      if (a.type === roleFilter && b.type === roleFilter) {
        return a.username.localeCompare(b.username);
      } else if (a.type === roleFilter) {
        return -1; // Keep the filtered type at the top
      } else if (b.type === roleFilter) {
        return 1;
      }
    }
    // Default sorting if no specific role filter is matched
    return a.username.localeCompare(b.username);
  });

  // Render the sorted users table
  renderUserTable(users);
}


document.getElementById('userSearchInput').oninput = () => {
  filterUsers(users); // Ensure the users array is passed as an argument
};


async function deleteUser(userId) {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    // Check if the response is successful
    if (response.ok) {
      showNotification('User deleted successfully', 'success');
      fetchUsers(); // Refresh the user list after deletion
    } else {
      // If the deletion fails, notify the user
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }
  } catch (error) {
    showNotification(error.message, 'error');
  }
}


async function updateUserRole(userName, newType) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    showNotification('You must be logged in to update the user role');
    return;
  }

  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/user/${userName}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: newType }),
    });

    if (response.ok) {
      const result = await response.json();
      showNotification('User role updated successfully.', 'success');
      // Optional: dynamically update the UI if needed.

      fetchUsers();
    } else {
      const errorData = await response.json();
      showNotification(`Failed to update user role: ${errorData.message}`, 'error');
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    showNotification('An error occurred while updating the user role.', 'error');
  }
}



// Example functions for buttons
function manageUsers() {
  showNotification("Manage Users functionality");
}

function siteInfo() {
  showNotification("Site Information functionality");
}

function registerUser() {
  window.location.href = "signup.html";
}

function createPost() {
  window.location.href = "createPost.html"
}

function viewMyPosts() {
  showNotification("View My Posts functionality");
}

// Logout function
document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    const response = await fetch("https://infohub-ffez.onrender.com/api/logout", {
      method: "GET", // Ensure this matches the server route handling
      credentials: 'include' // Include cookies in the request
    });

    if (response.status === 204) {
      localStorage.clear(); // Clear user data
      document.getElementById("logoutMessage").textContent = "Logged out successfully.";
      document.getElementById("logoutMessage").style.color = "green";
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      document.getElementById("userInfo").style.display = "none";
      document.getElementById("readerName").style.display = "none";
      document.getElementById("userAuth").style.display = "block";
    } else {
      document.getElementById("logoutMessage").textContent = "Logout failed. Please try again.";
      document.getElementById("logoutMessage").style.color = "red";
    }
  } catch (error) {
    console.error("Logout error:", error);
    document.getElementById("logoutMessage").textContent = "An error occurred while logging out.";
    document.getElementById("logoutMessage").style.color = "red";
  }
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


function formatCommentDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}



let previewPostId = null;

async function openPreviewModal(postSlug) {
  previewPostId = postSlug; // Store postSlug globally
  console.log("currentPostId set to:", previewPostId);
  const modal = document.getElementById("postModal");
  modal.style.display = "block";

  if (!postSlug) {
    console.error("Post slug is missing.");
    return;
  }

  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/posts/${postSlug}`);
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return;
    }

    const post = await response.json();
    console.log("Fetched post:", post);

    // Display the post data in the modal
    document.title = post.title || "Default Title";

    const spinner = document.getElementById("spinner");
    const postContainer = document.getElementById("postContainer");

    // Hide spinner and show post container
    spinner.style.display = "none";
    postContainer.style.display = "block";

    const imageUrl = post.image ? `https://infohub-ffez.onrender.com${post.image}` : 'default-image-path.jpg';
    const authorName = post.author ? post.author.username : 'Unknown Author';

    postContainer.innerHTML = `
        <div class="post-header">
          <div class="post-image">
            <img src="${imageUrl}" alt="Blog Image Unavailable" />
          </div>
          <div class="post-breadcrumb">
            <a href="index.html">Home</a>
            <span><i class="fas fa-angle-right"></i></span>
            <a class="post-meta-a" href="/posts?postType=${encodeURIComponent(post.types.join(", "))}">${post.types.join(", ")}</a>
            <span><i class="fas fa-angle-right"></i></span>
            <a class="post-meta-a" href="/posts?category=${encodeURIComponent(post.categories.join(", "))}">${post.categories.join(", ")}</a>
            <span><i class="fas fa-angle-right"></i></span>
            ${post.subCategories.map(subCategory => `<a class="post-label-a" href="postList.html?subCategory=${encodeURIComponent(subCategory)}">${subCategory}</a>`).join('<span><i class="fas fa-angle-right"></i></span>')}
          </div>
          <h1><a href="/api/posts/post/${post.slug}">${post.title}</a></h1>
          <div class="post-meta-wrapper">
            <span><i class="fa-regular fa-comment"></i> ${Array.isArray(post.comments) ? post.comments.length : 0}</span>
            <span><i class="fa-regular fa-eye"></i> ${post.views || 0}</span>
            <span><i class="fa-regular fa-user"></i> ${authorName}</span>
            <span><i class="fa-regular fa-clock"></i> ${formatPostDate(new Date(post.createdAt))}</span>
          </div>
        </div>
        <div class="post-body entry-content">${post.content}</div>
        <div class="post-footer">
          <div class="post-label post-section-a">
            <h4><i class="fas fa-tag"></i> Labels</h4>
            ${post.tags.map(tag => `<a class="post-label-a" href="postList.html?tag=${encodeURIComponent(tag)}">${tag}</a>`).join(" ")}
          </div>
          <div class="post-share-buttons-holder">
            <a href="https://www.facebook.com/sharer.php?u=https://yourwebsite.com/api/posts/posts/${post.slug}" target="_blank" class="post-label facebook">
              <i class="fab fa-facebook-f"></i> Share
            </a>
            <a href="https://twitter.com/share?url=https://yourwebsite.com/api/posts/posts/${post.slug}" target="_blank" class="post-label twitter">
              <i class="fab fa-x"></i> Twitter
            </a>
            <a href="https://www.linkedin.com/shareArticle?url=https://yourwebsite.com/api/posts/posts/${post.slug}" target="_blank" class="post-label linkedin">
              <i class="fab fa-linkedin-in"></i> Share
            </a>
          </div>
          <input id="postUrlInput" value="https://yourwebsite.com/api/posts/posts/${post.slug}" readonly>
          <span id="copyButton" onclick="copyPostUrl()"><i class="fa-regular fa-copy"></i></span>
        </div>
        <div class="reaction-section">
          <h4>React to this post:</h4>
          ${["like", "love", "haha", "wow", "sad", "angry"].map(type => `
            <button onclick="toggleReaction('${post._id}', '${type}')">${getReactionIcon(type)} (${post.reactions?.[type] || 0})</button>
          `).join('')}
        </div>
        <div class="comments-section">
          <h4><i class="fas fa-comments"></i> Comments (${Array.isArray(post.comments) ? post.comments.length : 0})</h4>
          ${Array.isArray(post.comments) ? post.comments.map(comment => `
            <div class="comment" id="comment-${comment._id}">
              <div class="comment-header">
                <cite>${comment.author ? comment.author.username : "Unknown"}</cite>
                <span>${formatCommentDate(new Date(comment.createdAt))}</span>
              </div>
            </div>
          `).join('') : '<p>No comments yet.</p>'}
        </div>
      `;
  } catch (error) {
    console.error("Error fetching post data:", error);
  }
}

function closeModal() {
  document.getElementById("postModal").style.display = "none";
}


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


function openSiteManagement() {
  // Show the modal
  const modal = document.getElementById("siteMetricsModal");
  modal.style.display = "block";

  // Fetch the site metrics (simulated here with dummy data)
  fetchSiteMetrics();
}

function closeSiteMetricsModal() {
  // Close the modal
  const modal = document.getElementById("siteMetricsModal");
  modal.style.display = "none";
}

// Frontend function to fetch and display site metrics with charts
async function fetchSiteMetrics() {
  const spinner = document.getElementById("metricsSpinner");
  const container = document.getElementById("siteMetricsContainer");

  if (!spinner || !container) {
    console.error("Essential DOM elements are missing.");
    return;
  }

  // Show the spinner while loading
  spinner.style.display = "flex";
  container.style.display = "none";

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error("No access token found.");
    return;
  }

  try {
    // Fetch the analytics data
    const response = await fetch('https://infohub-ffez.onrender.com/api/analytics/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }

    const data = await response.json();

    // Update total stats
    const totalPageViews = document.getElementById("totalPageViews");
    const totalSignups = document.getElementById("totalSignups");
    const totalClicks = document.getElementById("totalClicks");
    const totalVisitors = document.getElementById("totalVisitors");

    if (totalPageViews) totalPageViews.textContent = data.totalPageViews || 'N/A';
    if (totalSignups) totalSignups.textContent = data.totalSignups || 'N/A';
    if (totalClicks) totalClicks.textContent = data.totalClicks || 'N/A';
    if (totalVisitors) totalVisitors.textContent = data.totalVisitors || 'N/A';

    // Update daily stats
    const dailyPageViews = document.getElementById("dailyPageView");
    const dailySignups = document.getElementById("dailySignups");
    const dailyClicks = document.getElementById("dailyClicks");
    const dailyVisitors = document.getElementById("dailyVisitors");

    if (dailyPageViews) dailyPageViews.textContent = data.dailyStats.pageViews || 'N/A';
    if (dailySignups) dailySignups.textContent = data.dailyStats.signups || 'N/A';
    if (dailyClicks) dailyClicks.textContent = data.dailyStats.clicks || 'N/A';
    if (dailyVisitors) dailyVisitors.textContent = data.dailyStats.visitors || 'N/A';

    // Update weekly stats
    const weeklyPageViews = document.getElementById("weeklyPageViews");
    const weeklySignups = document.getElementById("weeklySignups");
    const weeklyClicks = document.getElementById("weeklyClicks");
    const weeklyVisitors = document.getElementById("weeklyVisitors");

    if (weeklyPageViews) weeklyPageViews.textContent = data.weeklyStats.pageViews || 'N/A';
    if (weeklySignups) weeklySignups.textContent = data.weeklyStats.signups || 'N/A';
    if (weeklyClicks) weeklyClicks.textContent = data.weeklyStats.clicks || 'N/A';
    if (weeklyVisitors) weeklyVisitors.textContent = data.weeklyStats.visitors || 'N/A';

    // Update monthly stats
    const monthlyPageViews = document.getElementById("monthlyPageViews");
    const monthlySignups = document.getElementById("monthlySignups");
    const monthlyClicks = document.getElementById("monthlyClicks");
    const monthlyVisitors = document.getElementById("monthlyVisitors");

    if (monthlyPageViews) monthlyPageViews.textContent = data.monthlyStats.pageViews || 'N/A';
    if (monthlySignups) monthlySignups.textContent = data.monthlyStats.signups || 'N/A';
    if (monthlyClicks) monthlyClicks.textContent = data.monthlyStats.clicks || 'N/A';
    if (monthlyVisitors) monthlyVisitors.textContent = data.monthlyStats.visitors || 'N/A';

    // Extract stats for charts and ensure canvas exists
    const pageViewsPerDayChart = document.getElementById('pageViewsPerDayChart');
    const clicksPerDayChart = document.getElementById('clicksPerDayChart');
    const signupsPerDayChart = document.getElementById('signupsPerDayChart');
    const visitorsPerDayChart = document.getElementById('visitorsPerDayChart');

    const pageViewsPerWeekChart = document.getElementById('pageViewsPerWeekChart');
    const clicksPerWeekChart = document.getElementById('clicksPerWeekChart');
    const signupsPerWeekChart = document.getElementById('signupsPerWeekChart');
    const visitorsPerWeekChart = document.getElementById('visitorsPerWeekChart');

    const pageViewsPerMonthChart = document.getElementById('pageViewsPerMonthChart');
    const clicksPerMonthChart = document.getElementById('clicksPerMonthChart');
    const signupsPerMonthChart = document.getElementById('signupsPerMonthChart');
    const visitorsPerMonthChart = document.getElementById('visitorsPerMonthChart');

    // Render Daily Stats Charts
    if (pageViewsPerDayChart) {
      renderChart(
        pageViewsPerDayChart.getContext('2d'),
        ['Page Views'],
        [data.dailyStats.pageViews],
        'Page Views Today',
        'rgba(75, 192, 192, 1)'
      );
    }
    if (clicksPerDayChart) {
      renderChart(
        clicksPerDayChart.getContext('2d'),
        ['Clicks'],
        [data.dailyStats.clicks],
        'Clicks Today',
        'rgba(255, 159, 64, 1)'
      );
    }
    if (signupsPerDayChart) {
      renderChart(
        signupsPerDayChart.getContext('2d'),
        ['Signups'],
        [data.dailyStats.signups],
        'Signups Today',
        'rgba(153, 102, 255, 1)'
      );
    }
    if (visitorsPerDayChart) {
      renderChart(
        visitorsPerDayChart.getContext('2d'),
        ['Visitors'],
        [data.dailyStats.visitors],
        'Visitors Today',
        'rgba(54, 162, 235, 1)'
      );
    }

    // Render Weekly Stats Charts
    if (pageViewsPerWeekChart) {
      renderChart(
        pageViewsPerWeekChart.getContext('2d'),
        ['Page Views'],
        [data.weeklyStats.pageViews],
        'Page Views This Week',
        'rgba(75, 192, 192, 1)'
      );
    }
    if (clicksPerWeekChart) {
      renderChart(
        clicksPerWeekChart.getContext('2d'),
        ['Clicks'],
        [data.weeklyStats.clicks],
        'Clicks This Week',
        'rgba(255, 159, 64, 1)'
      );
    }
    if (signupsPerWeekChart) {
      renderChart(
        signupsPerWeekChart.getContext('2d'),
        ['Signups'],
        [data.weeklyStats.signups],
        'Signups This Week',
        'rgba(153, 102, 255, 1)'
      );
    }
    if (visitorsPerWeekChart) {
      renderChart(
        visitorsPerWeekChart.getContext('2d'),
        ['Visitors'],
        [data.weeklyStats.visitors],
        'Visitors This Week',
        'rgba(54, 162, 235, 1)'
      );
    }

    // Render Monthly Stats Charts
    if (pageViewsPerMonthChart) {
      renderChart(
        pageViewsPerMonthChart.getContext('2d'),
        ['Page Views'],
        [data.monthlyStats.pageViews],
        'Page Views This Month',
        'rgba(75, 192, 192, 1)'
      );
    }
    if (clicksPerMonthChart) {
      renderChart(
        clicksPerMonthChart.getContext('2d'),
        ['Clicks'],
        [data.monthlyStats.clicks],
        'Clicks This Month',
        'rgba(255, 159, 64, 1)'
      );
    }
    if (signupsPerMonthChart) {
      renderChart(
        signupsPerMonthChart.getContext('2d'),
        ['Signups'],
        [data.monthlyStats.signups],
        'Signups This Month',
        'rgba(153, 102, 255, 1)'
      );
    }
    if (visitorsPerMonthChart) {
      renderChart(
        visitorsPerMonthChart.getContext('2d'),
        ['Visitors'],
        [data.monthlyStats.visitors],
        'Visitors This Month',
        'rgba(54, 162, 235, 1)'
      );
    }

    // Hide spinner and show data
    spinner.style.display = "none";
    container.style.display = "block";

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    showNotification('Failed to load site metrics. Please try again later.');
    spinner.style.display = "none";
  }
}




/**
 * Helper function to render a chart
 * @param {CanvasRenderingContext2D} ctx - Chart context
 * @param {Array} labels - Chart labels (e.g., dates or months)
 * @param {Array} data - Data points
 * @param {String} label - Chart label
 * @param {String} color - Line color
 */
function renderChart(ctx, labels, data, label, color) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: `${color}33`, // Semi-transparent background color
        borderWidth: 2,
        pointBackgroundColor: color,
        pointRadius: 4, // Points size
        fill: true, // Fill the area under the line
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow chart to scale responsively
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
            },
            color: '#333', // Legend text color
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          bodyColor: '#fff',
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#333'
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#555'
          }
        },
        y: {
          title: {
            display: true,
            text: label,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#333'
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#555'
          }
        }
      }
    }
  });
}



// const subscriptionsTable = document.getElementById('subscriptionsTable').querySelector('tbody');
// const filterButtons = document.querySelectorAll('.filters button');
// let currentSubPage = 1;
// const subscriptionsPerPage = 10;

const subscriptionsTable = document.getElementById('subscriptionsTable').querySelector('tbody');
const filterButtons = document.querySelectorAll('.filters button');
const countsDisplay = document.getElementById('countsDisplay'); // A div for displaying counts
let currentSubPage = 1;
const subscriptionsPerPage = 10;

const fetchSubscriptions = async (status = '', page = 1) => {
  try {
    // Build query string for filtering
    const email = document.getElementById('filter-email').value;
    const type = document.getElementById('filter-type').value;
    const niche = document.getElementById('filter-niche').value;

    const query = new URLSearchParams({ email, type, niche, status, page, limit: subscriptionsPerPage }).toString();

    const response = await fetch(`https://infohub-ffez.onrender.com/api/newsLetter/subscriptions?${query}`);
    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    // Clear the table and populate new data
    subscriptionsTable.innerHTML = '';
    data.data.forEach(sub => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${sub.username}</td>
                <td>${sub.email}</td>
                <td>${sub.type}</td>
                <td>${sub.isUnsubscribed ? 'Unsubscribed' : 'Active'}</td>
                <td class="actions">
                    ${sub.isUnsubscribed
          ? `<button onclick="resubscribeUser('${sub._id}')">Re-subscribe</button>`
          : `<button onclick="unsubscribeUser('${sub._id}')">Unsubscribe</button>`
        }
                </td>
            `;
      subscriptionsTable.appendChild(row);
    });

    // Update pagination controls
    document.getElementById('pageInfo').textContent = `Page ${data.page}/${data.totalPages}`;
    currentSubPage = data.page;

    // Disable/enable pagination buttons
    document.getElementById('prevPage').disabled = currentSubPage <= 1;
    document.getElementById('nextPage').disabled = currentSubPage >= data.totalPages;

    // Update counts display
    countsDisplay.innerHTML = `
            <p>Active: ${data.counts.active}</p>
            <p>Unsubscribed: ${data.counts.unsubscribed}</p>
            <p>Newsletter Subscribers: ${data.counts.newsletter}</p>
            <p>Updates Subscribers: ${data.counts.updates}</p>
        `;

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    showNotification('Failed to load subscriptions.');
  }
};

// Change page when clicking previous/next
const changePage = (direction) => {
  const newPage = currentSubPage + direction;
  if (newPage > 0) fetchSubscriptions('', newPage);
};

// Attach event listeners to filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const status = button.id === 'filterActive' ? 'active' : 'unsubscribed';
    fetchSubscriptions(status, 1); // Reset to first page
  });
});


// Filter form submission event listener
document.getElementById('filter-form').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get current filter values
  const email = document.getElementById('filter-email').value;
  const type = document.getElementById('filter-type').value;
  const niche = document.getElementById('filter-niche').value;

  // Build query string
  const query = new URLSearchParams({ email, type, niche }).toString();

  // Fetch filtered subscriptions from the server
  fetch(`https://infohub-ffez.onrender.com/api/newsLetter/subscriptions?${query}&page=1`)
    .then(response => response.json())
    .then(data => {
      subscriptionsTable.innerHTML = ''; // Clear existing content
      if (data.success && data.data.length > 0) {
        data.data.forEach(subscription => {
          const row = document.createElement('tr');
          row.className = 'subscription-item';
          row.innerHTML = `
                        <td><strong>Email:</strong> ${subscription.username}</td>
                        <td><strong>Email:</strong> ${subscription.email}</td>
                        <td><strong>Type:</strong> ${subscription.type}</td>
                        <td><strong>Niches:</strong> ${subscription.niches.join(', ')}</td>
                        <td><strong>Subscribed At:</strong> ${new Date(subscription.subscribedAt).toLocaleString()}</td>
                    `;
          subscriptionsTable.appendChild(row);
        });
      } else {
        subscriptionsTable.innerHTML = '<p>No subscriptions found.</p>';
      }
    })
    .catch(() => {
      document.getElementById('subscriptionsTable').innerHTML = '<p>Error loading subscriptions.</p>';
    });
});


const unsubscribeUser = async (_id) => {
  console.log('subscriber Id:', _id)
  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/newsLetter/unsubscribe/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read non-JSON responses
      throw new Error(errorText || 'Failed to unsubscribe.');
    }

    const data = await response.json();

    showNotification(data.message);
    fetchSubscriptions('active'); // Refresh the list to show updated status
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    showNotification(error.message || 'Failed to unsubscribe user.');
  }
};





const resubscribeUser = async (id) => {
  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/newsLetter/subscriptions/${id}/resubscribe`, {
      method: 'PUT',
    });
    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    showNotification(data.message);
    fetchSubscriptions('unsubscribed');
  } catch (error) {
    console.error('Error re-subscribing user:', error);
    showNotification('Failed to re-subscribe user.');
  }
};

// Load active subscriptions by default
fetchSubscriptions('active');



const messagesTable = document.getElementById('messagesTable').querySelector('tbody');
const messageFilterButtons = document.querySelectorAll('.filters button');
const messageCountsDisplay = document.getElementById('messageCountsDisplay');
let currentMessagePage = 1;
const messagesPerPage = 10;

// Fetch messages with filtering and pagination
const fetchMessages = async (status = '', page = 1) => {
  try {
    const email = document.getElementById('filter-message-email').value;
    const name = document.getElementById('filter-message-name').value;

    const query = new URLSearchParams({
      email,
      name,
      status,
      page,
      limit: messagesPerPage,
    }).toString();

    const response = await fetch(`https://infohub-ffez.onrender.com/api/contact/messages?${query}`);
    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    messagesTable.innerHTML = '';
    data.data.forEach(msg => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${msg.name}</td>
                <td>${msg.email}</td>
                <td>${msg.subject}</td>
                <td>${msg.isReplied ? 'Replied' : 'Unreplied'}</td>
                <td class="actions">
                    <button onclick="replyToMessage('${msg._id}', '${msg.email}', '${msg.name}', '${msg.subject}')">
                        Reply
                    </button>
                </td>
            `;
      messagesTable.appendChild(row);
    });

    document.getElementById('messagePageInfo').textContent = `Page ${data.page}/${data.totalPages}`;
    currentMessagePage = data.page;
    document.getElementById('prevMessagePage').disabled = currentMessagePage <= 1;
    document.getElementById('nextMessagePage').disabled = currentMessagePage >= data.totalPages;

    messageCountsDisplay.innerHTML = `
            <p>Replied: ${data.counts.replied}</p>
            <p>Unreplied: ${data.counts.unreplied}</p>
        `;
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

const changeMessagePage = (direction) => {
  const newPage = currentMessagePage + direction;
  if (newPage > 0) fetchMessages('', newPage);
};

messageFilterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const status = button.id === 'filterReplied' ? 'replied' : 'unreplied';
    fetchMessages(status, 1);
  });
});

document.getElementById('message-filter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  fetchMessages('', 1);
});

const replyFormContainer = document.createElement('div');
replyFormContainer.className = 'form-container hidden'; // Hidden by default
document.body.appendChild(replyFormContainer);

const replyToMessage = (id, email, name, subject) => {
  // Populate the form
  replyFormContainer.innerHTML = `
        <h2>Reply to Contact Message</h2>
        
        <label for="recipientEmail">Recipient's Email</label>
        <input type="email" id="recipientEmail" value="${email}" readonly>

        <label for="recipientEmail">Recipient's Email</label>
        <input type="text" id="recipientName" value="${name}" readonly>

        <label for="subject">Email Subject</label>
        <input type="text" id="subject" value="${subject}" readonly>

        <label for="title">Email Title</label>
        <input type="text" id="title" placeholder="Email Title" required>

        <label for="message">Message</label>
        <textarea id="message" rows="6" placeholder="Write your reply here" required></textarea>

        <label for="supportName">Your Name (Support Team)</label>
        <input type="text" id="supportName" placeholder="Support Team Member Name" required>

        <button onclick="sendReply('${id}')">Send Reply</button>
        <button onclick="hideReplyForm()">Cancel</button>
    `;

  // Show the form
  replyFormContainer.classList.remove('hidden');
};

const hideReplyForm = () => {
  replyFormContainer.classList.add('hidden');
};

async function sendReply(id) {
  const recipientEmail = document.getElementById('recipientEmail').value;
  const recipientName = document.getElementById('recipientName').value;
  const subject = document.getElementById('subject').value;
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;
  const supportName = document.getElementById('supportName').value;

  if (!recipientEmail || !recipientName || !subject || !title || !message || !supportName) {
    showNotification("Please fill out all fields.");
    return;
  }

  const replyContent = `
        <h1>${title}</h1>
        <p style="line-height: 1.8;">${message}</p>
    `;

  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/contact/send-reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        recipientEmail,
        recipientName,
        subject,
        replyContent,
        supportName,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      showNotification(result.message);
      hideReplyForm();
      fetchMessages(); // Refresh messages list
    } else {
      showNotification(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error sending reply:', error);
    showNotification('Failed to send reply. Please try again later.');
  }
}


// Initial fetch
fetchMessages();


document.getElementById('createPromotion').addEventListener('click', () => {
  document.getElementById('promotionFormPanel').style.display = 'block';
  initializePromotionEditor();
});

// Submit promotion logic
async function submitPromotion() {


  const title = document.getElementById('promotionTitle').value;
  const link = document.getElementById('promotionLink').value;
  const senderName = document.getElementById('promotionSenderName').value;
  const content = promotionQuill ? promotionQuill.root.innerHTML : '';

  if (!title || !link || !content || !senderName) {
    showNotification('Please fill out all fields.');
    return;
  }

  try {
    const response = await fetch('https://infohub-ffez.onrender.com/api/promotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, link, content, senderName })
    });

    const result = await response.json();
    if (response.ok) {
      showNotification(result.message);
      closePromotionForm();
    } else {
      showNotification(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Error submitting promotion:', error);
    showNotification('Failed to submit promotion. Please try again.');
  }
}

//logic to close the promotion form
function closePromotionForm() {
  document.getElementById('promotionFormPanel').style.display = 'none';
}

let currentPromotionPage = 1;
let totalPages = 1;

async function fetchPromotions() {
  const titleFilter = document.getElementById('filterTitle').value;
  const senderFilter = document.getElementById('filterSender').value;
  const sortBy = document.getElementById('sortBy').value;

  const queryParams = new URLSearchParams({
    title: titleFilter,
    sender: senderFilter,
    sort: sortBy,
    page: currentPromotionPage,
    limit: 10,
  }).toString();

  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/promotion?${queryParams}`);
    const result = await response.json();

    if (response.ok) {
      // Update counts and pagination
      document.getElementById('totalPromotions').textContent = result.totalCount;
      document.getElementById('currentPage').textContent = result.page;
      document.getElementById('totalPages').textContent = result.totalPages;

      // Enable/Disable pagination buttons
      document.getElementById('prevPage').disabled = result.page === 1;
      document.getElementById('nextPage').disabled = result.page === result.totalPages;

      // Populate table
      const tableBody = document.querySelector("#promotionTable tbody");
      tableBody.innerHTML = ''; // Clear existing rows

      result.data.forEach(promotion => {
        const row = document.createElement('tr');
        row.innerHTML = `
                        <td>${promotion.title}</td>
                        <td>${new Date(promotion.sentAt).toLocaleString()}</td>
                        <td>${promotion.senderName}</td>
                        <td>
                            <button onclick="resendPromotion('${promotion._id}')">Resend</button>
                            <button onclick="deletePromotion('${promotion._id}')">Delete</button>
                        </td>
                    `;
        tableBody.appendChild(row);
      });
    } else {
      showNotification('Failed to fetch promotions.');
    }
  } catch (error) {
    console.error('Error fetching promotions:', error);
  }
}

document.getElementById('refreshPromotions').addEventListener('click', () => {
  currentPromotionPage = 1;
  fetchPromotions();
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPromotionPage > 1) {
    currentPromotionPage--;
    fetchPromotions();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPromotionPage < totalPages) {
    currentPromotionPage++;
    fetchPromotions();
  }
});


async function resendPromotion(id) {
  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/promotion/resend/${id}`, {
      method: 'POST'
    });
    const result = await response.json();

    if (response.ok) {
      showNotification('Promotion resent successfully.');
    } else {
      showNotification(`Failed to resend promotion: ${result.message}`);
    }
  } catch (error) {
    console.error('Error resending promotion:', error);
  }
}

async function deletePromotion(id) {
  if (!confirm('Are you sure you want to delete this promotion?')) return;

  try {
    const response = await fetch(`https://infohub-ffez.onrender.com/api/promotion/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (response.ok) {
      showNotification('Promotion deleted successfully.');
      fetchPromotions(); // Refresh the list
    } else {
      showNotification(`Failed to delete promotion: ${result.message}`);
    }
  } catch (error) {
    console.error('Error deleting promotion:', error);
  }
}

// Fetch promotions on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchPromotions();
  document.getElementById('refreshPromotions').addEventListener('click', fetchPromotions);
});


document.getElementById('send-newsletter-btn').addEventListener('click', async () => {
  showNotification('Sending newsletter...');

  try {
      const response = await fetch('https://infohub-ffez.onrender.com/api/newsLetter/send-now', {
          method: 'POST'
      });

      if (response.ok) {
          const result = await response.json();
          showNotification(result.message || 'Newsletter sent successfully!');
      } else {
          const error = await response.text();
          showNotification(`Failed: ${error}`);
      }
  } catch (error) {
      console.error('Error:', error);
      showNotification('An error occurred while sending the newsletter.');
  }
});


// Ad Upload Handler
document.getElementById('ad-upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // Get all selected checkboxes for placeholders and convert them to numbers
  const placeholders = Array.from(document.querySelectorAll('input[name="placeholder"]:checked')).map(
      (input) => Number(input.value)
  );

  formData.delete('placeholder'); // Remove the existing placeholders
  placeholders.forEach((placeholder) => formData.append('placeholders', placeholder));

  const statusDiv = document.getElementById('upload-status');

  try {
      const response = await fetch('https://infohub-ffez.onrender.com/api/ads/upload', {
          method: 'POST',
          body: formData,
      });
      const result = await response.json();
      if (response.ok) {
          showNotification('Ad uploaded successfully!');
      } else {
          showNotification(`Error: ${result.error}`);
      }
  } catch (error) {
      showNotification('Upload failed. Please try again.');
  }
});
