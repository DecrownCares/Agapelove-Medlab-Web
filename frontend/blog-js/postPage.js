
// Fetch and display a single post based on the post ID in the URL
// function timeAgo(date) {
//   const seconds = Math.floor((new Date() - date) / 1000);
//   let interval = Math.floor(seconds / 31536000);

//   if (interval > 1) return `${interval}yr ago`;
//   interval = Math.floor(seconds / 2592000);
//   if (interval > 1) return `${interval}m ago`;
//   interval = Math.floor(seconds / 604800);
//   if (interval > 1) return `${interval}wk ago`;
//   interval = Math.floor(seconds / 86400);
//   if (interval > 1) return `${interval}d ago`;
//   interval = Math.floor(seconds / 3600);
//   if (interval > 1) return `${interval}hrs ago`;
//   interval = Math.floor(seconds / 60);
//   if (interval > 1) return `${interval}min ago`;
//   return `${Math.floor(seconds)}sec ago`;
// }


// function updateMetaTags(metaData) {
//   console.log("Updating meta tags with:", metaData);

//   // Update the title
//   document.title = metaData.title || "Default Title";

//   // Helper to strip HTML tags from content
//   const stripHtmlTags = (htmlString) => {
//     const doc = new DOMParser().parseFromString(htmlString, 'text/html');
//     return doc.body.textContent || "";
//   };
  
//    // Helper to generate a full URL
//    const generateFullUrl = (relativePath) => {
//     const baseUrl = window.location.origin; // Gets the base URL
//     console.log("Base URL:", baseUrl);
//     console.log("Image relative path:", relativePath);
//     if (relativePath && !relativePath.startsWith("https")) {
//       const fullUrl = `${baseUrl}${relativePath}`;
//       console.log("Generated full URL for image:", fullUrl);
//       return fullUrl;
//     }
//     console.log("Using already full URL for image:", relativePath);
//     return relativePath;
//   };

//   // Ensures full URLs for images
//   const ogImageFullUrl = generateFullUrl(metaData.ogImage || '/default-image.jpg');
//   const twitterImageFullUrl = generateFullUrl(metaData.twitterImage || '/default-image.jpg');

//   // List of meta tags to update
//   const metaTags = [
//     { name: 'description', content: stripHtmlTags(metaData.ogDescription || metaData.description) },
//     { name: 'keywords', content: metaData.keywords },
//     { property: 'og:title', content: metaData.ogTitle || metaData.title },
//     { property: 'og:description', content: stripHtmlTags(metaData.ogDescription || metaData.description) },
//     { property: 'og:image', content: ogImageFullUrl  },
//     { property: 'og:url', content: metaData.canonicalUrl },
//     { name: 'twitter:card', content: 'summary_large_image' },
//     { name: 'twitter:title', content: metaData.twitterTitle || metaData.title },
//     { name: 'twitter:description', content: stripHtmlTags(metaData.ogDescription || metaData.description) },
//     { name: 'twitter:image', content: twitterImageFullUrl || metaData.ogImage },
//     { name: 'twitter:url', content: metaData.canonicalUrl },
//     { name: 'robots', content: metaData.robots || "index, follow" },
//     { name: 'last-modified', content: metaData.lastModified },
//     // { rel: 'canonical', href: metaData.canonicalUrl }
//   ];

//   metaTags.forEach(tag => {
//     const selector = tag.property ? `meta[property="${tag.property}"]` : `meta[name="${tag.name}"]`;
//     let metaTag = document.querySelector(selector);

//     if (metaTag) {
//       // Update the existing tag
//       metaTag.setAttribute('content', tag.content);
//     } else {
//       // Create new tag if not found
//       metaTag = document.createElement('meta');
//       Object.entries(tag).forEach(([key, value]) => metaTag.setAttribute(key, value));
//       document.head.appendChild(metaTag);
//     }
//   });

//   // Update or add the canonical link tag
//   let canonicalTag = document.querySelector('link[rel="canonical"]');
//   if (canonicalTag) {
//     canonicalTag.setAttribute('href', metaData.canonicalUrl);
//   } else {
//     canonicalTag = document.createElement('link');
//     canonicalTag.setAttribute('rel', 'canonical');
//     canonicalTag.setAttribute('href', metaData.canonicalUrl);
//     document.head.appendChild(canonicalTag);
//   }
// }



function showSiteComments() {
  console.log("Showing Site Comments");

  // Show all elements with the class 'comment'
  const siteComments = document.getElementsByClassName('comment');
  for (let i = 0; i < siteComments.length; i++) {
    siteComments[i].style.display = 'block';
    siteComments[i].style.borderTop = '1px solid hsla(0, 0%, 47%, .333)';
    siteComments[i].style.fontWeight = 'bold';
  }

  // Hide the Facebook comments section
  const facebookCommentsSection = document.getElementById('facebookCommentsSection');
  if (facebookCommentsSection) {
    facebookCommentsSection.style.display = 'none';
    facebookCommentsSection.style.borderTop = 'none';
  }

  // Reset the Facebook button styling
  const facebookCommentButton = document.getElementById('facebookCommentButton');
  if (facebookCommentButton) {
    facebookCommentButton.style.fontWeight = 'normal';
  }
}

function showFacebookComments() {
  console.log("Showing Facebook Comments");

  // Hide all elements with the class 'comment'
  const siteComments = document.getElementsByClassName('comment');
  for (let i = 0; i < siteComments.length; i++) {
    siteComments[i].style.display = 'none';
    siteComments[i].style.borderTop = 'none';
    siteComments[i].style.fontWeight = 'normal';
  }

  // Show the Facebook comments section
  const facebookCommentsSection = document.getElementById('facebookCommentsSection');
  if (facebookCommentsSection) {
    facebookCommentsSection.style.display = 'block';
    facebookCommentsSection.style.borderTop = '1px solid hsla(0, 0%, 47%, .333)';
  }

  // Highlight the Facebook button
  const facebookCommentButton = document.getElementById('facebookCommentButton');
  if (facebookCommentButton) {
    facebookCommentButton.style.fontWeight = 'bold';
  }

  // Reinitialize Facebook comments plugin if the SDK is loaded
  if (typeof FB !== 'undefined') {
    FB.XFBML.parse();
  } else {
    console.log('Facebook SDK is not loaded yet, retrying...');
    setTimeout(function () {
      if (typeof FB !== 'undefined') {
        FB.XFBML.parse();
      } else {
        console.error('Facebook SDK failed to load');
      }
    }, 1000); // Retry after 1 second
  }
}


// Initialize page with site comments shown by default
// document.addEventListener("DOMContentLoaded", function() {
//   showSiteComments();  // Make sure the site comments are displayed when the page loads
// });


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

// Function to format date for post published
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

// Function to copy the URL to the clipboard
function copyPostUrl() {
  const inputField = document.getElementById("postUrlInput");
  inputField.select();
  inputField.setSelectionRange(0, 99999); // For mobile devices

  navigator.clipboard.writeText(inputField.value).then(() => {
    document.getElementById("copyMsg").innerText = "Copied";

    // Hide the message after 3 seconds
    setTimeout(() => {
      document.getElementById("copyMsg").innerText = ""; // Clears the text
      // document.getElementById("copyMsg").style.display = "none";
    }, 3000);
  }).catch(err => {
    console.error("Failed to copy URL: ", err);
    showNotificationBottomRight("Failed to copy URL", 'error');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const placeholders = {
    1: document.querySelector('.first-ad'),
    2: document.querySelector('.second-ad'),
    3: document.querySelector('.potriate-ads'),
  };

  // Predefined CTA buttons
  const ctaButtons = ["Click Link", "Learn More"];

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
          container.innerHTML = '<p>Advertise Your Brand Here</p>';
        }
        return;
      }

      const ad = ads[index];
      const randomCTA = ctaButtons[Math.floor(Math.random() * ctaButtons.length)];
      container.innerHTML = `
              <a href="${ad.targetUrl}" target="_blank">
                  <img loading="lazy" decoding="async" src="https://agapelove-medlab-ms.onrender.com${ad.imageUrl}" alt="Ad Banner" title="Click to visit - ${ad.targetUrl} for more inquiries">
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

// document.addEventListener("DOMContentLoaded", function () {
//   const adModal = new bootstrap.Modal(document.getElementById("popupAdModal"));

//   // Show ad after 10 seconds
//   setTimeout(() => {
//     adModal.show();
//   }, 10000);

//   // Reappear every 5 minutes (300,000ms)
//   setInterval(() => {
//     adModal.show();
//   }, 300000);
// });


// const apiBaseUrl = window.location.hostname.includes("localhost") 
//   ? "http://localhost:3173"
//   : "https://agapelove-medlab-ms.onrender.com";
async function fetchSinglePost() {
  // Extract post ID from URL path
  const pathParts = window.location.pathname.split("/");
  const postId = pathParts[pathParts.length - 1]; // Get the last part of the URL path

  if (!postId) {
    console.error("Post ID is missing from the URL.");
    return;
  }

  try {
    // Fetch the single post data
    const response = await fetch(`https://agapelove-medlab-ms.onrender.com/api/posts/blog/post/${postId}?t=${new Date().getTime()}`);
    console.log("Fetched post:", response);
    const post = await response.json();
    console.log("Fetched post:", post);
    console.log("Comments data:", post.comments);
    // Check if meta exists and update meta tags
    if (post && post.meta && typeof post.meta === 'object') {
      console.log("Meta data:", post.meta);
      // updateMetaTags(post.meta);
    } else {
      console.warn("Meta data is missing or invalid");
      showNotificationCenter("Failed to fetch post data", 'warning');
    }

    document.title = post.title || "Default Title"; // Set the page title to the post's title


    // Display post details
    // const spinner = document.getElementById("post-spinner");
    const postContainer = document.getElementById("postContainer");

    // Show the spinner and hide the posts container initially
    // spinner.style.display = "block";
    postContainer.style.display = "none";
    const imageUrl = post.image  || 'default-image-path.jpg';
    const authorName = post.author ? post.author?.fullName : 'Unknown Author';
    const types = Array.isArray(post.types) ? post.types.join(", ") : "Unknown Type";
    const categories = Array.isArray(post.categories) ? post.categories.join(", ") : "Uncategorized";
    const subCategories = Array.isArray(post.subCategories) 
      ? post.subCategories.map(subCategory => `<a style="color: #3368c6;" class="post-label-a" href="/api/posts/all/blog-list?subCategory=${encodeURIComponent(subCategory)}">${subCategory}</a>`).join(` <span><i class="fas fa-angle-right"></i></span> `)
    : "No Subcategories";
    const tags = Array.isArray(post.tags) 
      ? post.tags.map(tag => `<a class="post-label-a" href="/api/posts/all/blog-list?tag=${encodeURIComponent(tag)}"><span class="bg label-name">${tag}</span></a>`).join(" ")
    : "No Tags";

    let sponsoredLabel = '';
        if (post.isSponsored) {
            sponsoredLabel = '<div class="sponsored-label"><i class="fas fa-bullhorn"></i>&nbsp; Sponsored</div>';
        }


    let contentHTML = `
    <div class="post-header">
      ${sponsoredLabel}
      <div class="post-image">
        <img src="${imageUrl}" title="${post.title}" alt="${post.title}" loading="lazy"/>
      </div>

      <div class="post-breadcrumb">
        <a href="/">Home</a>
        <span><i class="fas fa-angle-right"></i></span>
        <a class="post-meta-a" style="color: #3368c6;" href="/api/posts/all/blog-list?postType=${encodeURIComponent(types)}">${types}</a>
        <span><i class="fas fa-angle-right"></i></span>
        <a class="post-meta-a" style="color: #3368c6;" href="/api/posts/all/blog-list?category=${encodeURIComponent(categories)}">${categories}</a>
        <span><i class="fas fa-angle-right"></i></span>
        ${subCategories}
      </div>

      <h1><a style="color: #007bff;" href="/api/posts/post/${post.slug}">${post.title}</a></h1>

      <div class="post-meta-wrapper">
        <span><i class="fa-regular fa-comment fa-flip fa-lg fa-light"></i> <span class="post-meta-detail">${Array.isArray(post.comments) ? post.comments.length : 0}</span></span>
        <span><i class="fa-regular fa-eye fa-lg fa-light"></i> <span class="post-meta-detail">${post.views || 0}</span></span>
        <span><i class="fa-regular fa-user fa-lg fa-light"></i> <span class="post-meta-detail">${post.author ? post.author?.fullName : "Unknown author"}</span></span>
        <span><i class="fa-regular fa-clock fa-lg fa-light"></i></i> <span class="post-meta-detail">${formatPostDate(new Date(post.createdAt))}</span></span>
    </div>

    <div class="post-body entry-content" itemprop="description articleBody">
      
        ${post.content}

     
    </div>


    <div class="post-footer">
      <div class="post-label post-section">
        <h4 class="post-section-title">
          <i class="fas fa-tag"></i>
          Labels
        </h4>
            ${tags}
      </div>
      <div class="clear"></div>

      <div class="post-section post-share-buttons">
        <h4 class="post-section-title">
          <i class="fas fa-share-alt"></i>
          <span data-l10n="SHARE:">SHARE<span id="share-count">(${post.shares})</span>:</span>
        </h4>
        <div class="post-share-buttons-holder">
          <a href="https://www.facebook.com/sharer.php?u=https://agapelovemedicallaboratory.com/api/posts/post/${post.slug}" target="_blank" aria-label="Share on Facebook" id="share-button" data-post-id="${post._id}" class="post-label p-facebook">
            <span class="bg label-name"><i class="fab fa-facebook-f"></i> Share</span>
          </a>
          <a href="https://twitter.com/share?url=https://agapelovemedicallaboratory.com/api/posts/post/${post.slug}" target="_blank"   aria-label="Share on Twitter" id="share-button" data-post-id="${post._id}" class="post-label twitter">
            <span class="bg label-name"><i class="fab fa-x"></i> Twitter</span>
          </a>
          <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://agapelovemedicallaboratory.com/api/posts/post/${post.slug}" target="_blank" aria-label="Share on LinkedIn" id="share-button" data-post-id="${post._id}" class="post-label linkedin">
            <span class="bg label-name"><i class="fab fa-linkedin-in"></i> Share</span>
          </a>
          <a href="https://api.whatsapp.com/send?text=Check%20out%20this%20post%20on%20InfoHub%20Website:%20https://agapelovemedicallaboratory.com/api/posts/post/${post.slug}" class="post-label whatsapp" id="share-button" data-post-id="${post._id}"><span class="bg label-name"><i class="fab fa-whatsapp"></i> Share</span></a>
          <a href="mailto:?subject=Check%20out%20this%20post&body=Hey,%20I%20found%20this%20interesting%20post:%20https://agapelovemedicallaboratory.com/posts/${post.slug}" data-post-id="${post._id}" class="post-label email"><span class="bg label-name"><i class="fas fa-envelope"></i> Email</span></a>
        </div>
      </div>
      <div class="post-share-url">
        <input class="post-share-buttons-url" id="postUrlInput" value="https://agapelovemedicallaboratory.com/api/posts/post/${post.slug}" readonly>
        <span id="copyButton" title="copy" id="share-button" data-post-id="${post._id}" onclick="copyPostUrl()"><i class="fa-regular fa-copy fa-light fa-lg"></i>
        </span>
        <div id="copyMsg"></div>
        <div class="clear"></div>
      </div>
      

      <div class="post-section-author post-author-box">
        <h4 class="post-section-title">
          <i class="fas fa-pencil-square"></i>
          <span data-l10n="AUTHOR">AUTHOR:</span>
          
        </h4>
        <div class="clear"></div>
        <div class="post-author-box-content">
          <div class="author-profile has-avatar">
            <img alt="author-avatar" class="author-profile-avatar cir" height="50px" src="https://agapelove-medlab-ms.onrender.com${post.author?.imageUrl}" width="50px" style="border-radius: 100px;"> &nbsp;
            <a href="#"><strong title="author profile">${authorName}</strong></a>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>


    <div class="reaction-section">
        <h4>React to this blog:</h4>
        <div class="reaction-btn-container">
          ${["like", "love", "haha", "wow", "sad", "angry"].map(type => `
            <button class="reaction-btn reaction-${type}" onclick="toggleReaction('${post._id}', '${type}')">
                ${getReactionIcon(type)} (${post.reactions?.[type] || 0})
            </button>
          `).join('')}
        </div>
      </div>


      <div class="comments-section">
    <h4 style="display: inline-block;"><i class="fas fa-comments"></i> Comments</h4>
    
    <!-- Toggle Buttons: Site Comments / Facebook Comments -->
    <div class="comment-toggle-buttons" style="display: inline-block; margin-left: 20px;">
        <button id="siteCommentButton" class="toggle-btn site-comment" onclick="showSiteComments()">Site(${Array.isArray(post.comments) ? post.comments.length : 0}) &nbsp; <i class="fas fa-chevron-down"></i></button>
        <button id="facebookCommentButton" class="toggle-btn facebook-comment" onclick="showFacebookComments()">Facebook &nbsp; <i class="fas fa-chevron-down"></i></button>
    </div>

    <!-- Site Comments Section -->
    <div id="siteCommentsSection" class="comments-container" style="display: block; border-top: 1px solid #007bff; padding-top: 15px;">
        ${Array.isArray(post.comments) ? post.comments.map(comment => `
            <div class="comment" id="comment-${comment._id}" style="display: none;">
                <div class="avatar-image-container comment-avatar">
                    <img src="/images/default-user-icon.png" alt="Avatar's Avatar" class="avatar-image">
                </div>
                <div class="comment-block">
                    <div class="comment-header">
                        <cite class="user"><a>${comment.commenter || "Anonymous"}</a></cite>
                        <span class="comment-date">${formatCommentDate(new Date(comment.createdAt))}</span>
                    </div>
                    <div class="comment-content">
                        <span>${renderCommentWithTags(comment.content)}</span>
                    </div>
                    <div class="comment-actions">
                        <div class="comment-reply-action">
                            <a class="btn comment-reply comment-reply-link" onclick="showReplyInput('${post._id}', '${comment._id}')">REPLY<i class="fas fa-mail-forward color"></i></a>
                            <div id="reply-input-${comment._id}" class="reply-input-container" style="display: none;">
                            <input class="form-control replyText" type="text" name="replyer" placeholder="Enter your name (or leave blank for Anonymous)" id="replyer">
                                <input class="form-control replyText" type="text" id="replyText-${comment._id}" placeholder="Write your reply here" oninput="detectTagging(event, 'replyText-${comment._id}')"/>
                                <span class="btn" onclick="submitReply('${post._id}', '${comment._id}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                </span>
                                <div id="userSuggestions-replyText-${comment._id}" class="suggestions-dropdown" style="display: none;"></div>
                            </div>
                        </div>
                        <div class="comment-reaction">
                            ${["like", "love", "haha", "wow", "sad", "angry"].map(type => `
                                <button class="comment-reaction-btn reaction-${type}" onclick="toggleCommentReaction('${comment._id}', '${type}')">
                                    ${getReactionIcon(type)} (${comment.reactions?.[type] || 0})
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Replies container -->
                ${Array.isArray(comment.replies) ? `
                    <div class="comment-replies-container">
                        ${comment.replies.map(reply => `
                            <div class="comment reply" id="reply-${reply._id}">
                                <div class="avatar-image-container comment-avatar">
                                    <img alt="avatar" class="avatar-image" height="30px" src="/images/default-user-icon.png">
                                </div>
                                <div class="comment-block">
                                    <div class="comment-header">
                                        <cite class="user"><a>${reply.replyer || "Anonymous"}</a></cite>
                                        <span class="comment-date">${formatCommentDate(new Date(reply.createdAt))}</span>
                                    </div>
                                    <div class="comment-content">
                                        <span>${renderCommentWithTags(reply.content)}</span>
                                    </div>
                                    <div class="comment-actions">
                                        <div class="comment-reaction">
                                            ${["like", "love", "haha", "wow", "sad", "angry"].map(type => `
                                                <button class="comment-reaction-btn replyReaction-${type}" onclick="toggleReplyReaction('${reply._id}', '${type}')">
                                                ${getReactionIcon(type)} (${reply.replyReactions?.[type] || 0})
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('') : ''}
        <input class="form-control" type="text" name="commenter" placeholder="Enter your name (or leave blank for Anonymous)" id="commenter">
        <textarea class="form-control" type="text" id="newComment" placeholder="Add a comment" oninput="detectTagging(event, 'newComment')"></textarea>
        <div id="userSuggestions-newComment" class="suggestions-dropdown" style="display: none;"></div>
        <button class="comment-btn" onclick="addComment('${post._id}')">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        </button>
    </div>

    <!-- Facebook Comments Section (Initially hidden) -->
    <div id="facebookCommentsSection" class="comments-container" style="display: none; border-top: 3px solid #ccc; padding-top: 15px;">
        <div class="fb-comments" data-href="https://agapelove-medlab-ms.onrender.com/api/posts/${post._id}" data-width="100%" data-numposts="5"></div>
    </div>
</div>
`;

// Dynamically inject ads after every N paragraphs
const tempDiv = document.createElement('div');
tempDiv.innerHTML = contentHTML;

const paragraphs = tempDiv.querySelectorAll('.post-body p'); // Select all paragraphs
paragraphs.forEach((para, index) => {
  if ((index + 1) % 3 === 0) { // Inject after every 3rd paragraph
    const adContainer = document.createElement('div');
    adContainer.className = 'ad-container ad-in-content';
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
    para.after(adContainer); // Insert ad after the paragraph
  }
});

 // Adding ad after comments section
 const adAfterComments = `
 <div class="ad-container ad-in-comments">
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
   <ins class="adsbygoogle"
        style="display:block;"
        data-ad-client="ca-pub-XXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"></ins>
   <script>
     (adsbygoogle = window.adsbygoogle || []).push({});
   </script>
 </div>
`;
const commentsSection = tempDiv.querySelector('.comments-section');
commentsSection.insertAdjacentHTML('beforeend', adAfterComments); // Insert ad after comment section

postContainer.innerHTML = tempDiv.innerHTML;


  } catch (error) {
    console.error("Error fetching posts:", error);
    // Show an error message in the post container
    showNotificationBottomRight(`Error: Failed to fetch posts. Please try again later.`, 'error');
    postContainer.innerHTML = `<p>Error: ${error.message}</p>`;
} finally {
    // Hide the spinner and show the posts container
    // spinner.style.display = "none";
    postContainer.style.display = "block";
}
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


// I am an expert web developer, blogger and writer who is the founder of https://crowntips.com, a website about Article and Blog information platform




// Function to toggle like/unlike

function getUniqueVisitorID() {
  let visitorID = localStorage.getItem('visitor_id');
  if (!visitorID) {
      visitorID = 'visitor-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('visitor_id', visitorID);
  }
  return visitorID;
}
async function toggleReaction(postId, reactionType) {
  try {
    const visitorID = getUniqueVisitorID();

    const response = await fetch(`https://agapelove-medlab-ms.onrender.com/api/reactions/reaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, type: reactionType, visitorID })
    });

    if (response.status === 401) {
      showNotificationCenter(
        "Your session has expired. Please log in again.",
        "error"
      );
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to toggle reaction.");
    }

    const updatedReaction = await response.json();

    fetchSinglePost(); // Refresh the post to update reactions
  } catch (error) {
    console.error("Error toggling reaction:", error);
    showNotificationBottomRight(
      "An error occurred while processing your reaction. Please try again later.",
      "error"
    );
  }
}



// Function to handle toggling reactions for comments
// Function to handle toggling reactions for comments

async function toggleCommentReaction(commentId, reactionType) {
  try {
    const visitorID = getUniqueVisitorID();

    const response = await fetch(`https://agapelove-medlab-ms.onrender.com/api/reactions/${commentId}/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, type: reactionType, visitorID }) // Ensure 'type' is correct
    });

    if (response.status === 401) {
      showNotificationCenter(
        "Your session has expired. Please log in again.",
        "error"
      );
      return;
    }

    if (!response.ok) {
      const errorData = await response.json(); // Get error details
      console.error("Error from server:", errorData);
      throw new Error(errorData.message || "Error toggling reaction");
    }

    const { message, reactionCounts } = await response.json();
    console.log(message, reactionCounts); // Log for debugging

    
    // Update the UI with the new reaction counts
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement) {
      const reactionButtons = commentElement.getElementsByClassName('comment-reaction-btn');
      for (let button of reactionButtons) {
        const type = button.classList[1].split('-')[1]; // Extract the reaction type
        button.innerText = `${getReactionIcon(type)} (${reactionCounts[type] || 0})`;
      }
    }
    // fetchSinglePost();
  } catch (error) {
    console.error("Error toggling reaction:", error);
    showNotificationBottomRight(
      "An error occurred while processing your reaction. Please try again later.",
      "error"
    );
  }
}


async function toggleReplyReaction(replyId, replyReactionType) {
  try {
    const visitorID = getUniqueVisitorID();

    console.log('Reply ID:', replyId, 'Reaction type:', replyReactionType); // Log to verify values

    const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];
    if (!validReactions.includes(replyReactionType)) {
      console.error('Invalid reaction type:', replyReactionType);
      showNotificationCenter("Invalid reaction type. Please try again.", 'warning');
      return;
    }

    const response = await fetch(`https://agapelove-medlab-ms.onrender.com/api/reactions/replies/${replyId}/reaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ replyReactionType, visitorID })
    });

    if (response.status === 401) {
      showNotificationCenter(
        "Your session has expired. Please log in again.",
        "error"
      );
      return;
    }


    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from server:", errorData);
      throw new Error(errorData.message || "Error toggling reply reaction");
    }

    const { message, reactionCounts, userReaction } = await response.json();
    console.log(message, reactionCounts);

    // Update the UI with the new reaction counts
    const replyElement = document.getElementById(`reply-${replyId}`);
    if (replyElement) {
      const reactionButtons = replyElement.getElementsByClassName('reply-reaction-btn');
      for (let button of reactionButtons) {
        const type = button.classList[1].split('-')[1];
        button.innerText = `${getReactionIcon(type)} (${reactionCounts[type] || 0})`;
      }

      // Optionally highlight user's current reaction
      for (let button of reactionButtons) {
        button.classList.toggle("active", button.classList.contains(`reaction-${userReaction}`));
      }
    }
    await fetchSinglePost();
  } catch (error) {
    console.error("Error toggling reply reaction:", error);
    showNotificationBottomRight(
      "An error occurred while processing your reaction. Please try again later.",
      "error"
    );
  }
}




document.addEventListener('DOMContentLoaded', () => {
  const shareButton = document.getElementById('share-button');

  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const postId = shareButton.dataset.postId;

      try {
        const response = await fetch(`https://agapelove-medlab-ms.onrender.com/api/social/${postId}/share`, {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Share count updated: ${data.shares}`);
        } else {
          console.error('Failed to update share count');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
});




async function addComment(postId) {
  const commentText = document.getElementById("newComment").value;
  const visitorName = document.getElementById("commenter").value.trim() || "Anonymous"; 
  if (!commentText) {
    showNotificationBottomRight("Comment cannot be empty.", "warning");
    return;
  }

  // const tags = parseTags(content);

  try {
    const response = await fetch(`https://agapelove-medlab-ms.onrender.com/api/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: commentText, commenter: visitorName })
    });

    if (response.status === 401) {
      showNotificationCenter(
        "Session expired. Please log in again.",
        "info"
      );
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }
    await fetchSinglePost();
    showNotificationTopRight("Comment added successfully!", "success");
    // fetchSinglePost();
  } catch (error) {
    console.error("Failed to add comment:", error.message);
    showNotificationBottomRight(
      "An error occurred while adding your comment. Please try again later.",
      "error"
    );
  }
}


// Function to toggle reply input field
function showReplyInput(postId, commentId) {
  const replyContainer = document.getElementById(`reply-input-${commentId}`);
  replyContainer.style.display = replyContainer.style.display === "none" ? "block" : "none";
}

// Function to submit reply
async function submitReply(postId, commentId) {
  const replyText = document.getElementById(`replyText-${commentId}`).value.trim();
  const replyerName = document.getElementById("replyer").value.trim() || "Anonymous"; 
  
  if (!replyText) {
    showNotificationBottomRight("Please enter a reply.", "warning");
    return;
  }

  try {
    const response = await fetch(`https://agapelove-medlab-ms.onrender.com/api/comments/${postId}/comment/${commentId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: replyText, replyer: replyerName })
    });

    if (response.status === 401) {
      showNotificationCenter(
        "Session expired. Please log in again.",
        "info"
      );
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to reply to comment");
    }

    await fetchSinglePost(); // Refresh post to display the new reply
    showNotificationTopRight("Reply added successfully!", "success");
  } catch (error) {
    console.error("Error replying to comment:", error.message);
    showNotificationBottomRight(
      "An error occurred while adding your reply. Please try again later.",
      "error"
    );
  }
}





// Call fetchSinglePost on page load to display the post details
fetchSinglePost();



// Function to check if the user is an admin
function isAdmin() {
  // Check user role from local storage or session data
  const userRole = localStorage.getItem("userRole"); // Replace with actual check
  return userRole === "administrator"; // Fixed typo from "adminitrator" to "administrator"
}

// Fetch and display all posts
async function fetchPosts() {
  const spinner = document.getElementById("similar-content-spinner");
  const postContainer = document.getElementById("postContainers");

  // Show the spinner and hide the posts container initially
  spinner.classList.remove("spinner-hidden")
  spinner.classList.add("spinner-show")
  postContainer.style.display = "none";

  try {
    const response = await fetch("https://agapelove-medlab-ms.onrender.com/api/posts");
    const data = await response.json();

    if (!response.ok) {
      console.error("Server error:", data);
      throw new Error(data.message || "Failed to fetch posts");
    }

    // Extract the current post slug from the URL if available
    // const urlParams = new URLSearchParams(window.location.search);
    // const postSlug = urlParams.get("slug");
    const pathParts = window.location.pathname.split("/");
    const postSlug = pathParts[pathParts.length - 1]; // Get the last part of the URL path
    const currentPostResponse = await fetch(`https://agapelove-medlab-ms.onrender.com/api/posts/blog/post/${postSlug}`);
    const currentPost = await currentPostResponse.json();
    const currentPostCategory = Array.isArray(currentPost.categories) ? currentPost.categories[0] : null;

    // Filter posts by recency and category match
    const relatedPosts = data
      .filter(post => post.categories.includes(currentPostCategory) || post.isRelated)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by recency

    // Randomly select 10 posts from the filtered list
    const randomPosts = [];
    while (randomPosts.length < 10 && relatedPosts.length > 0) {
      const randomIndex = Math.floor(Math.random() * relatedPosts.length);
      randomPosts.push(relatedPosts.splice(randomIndex, 1)[0]);
    }

    // Clear previous content
    postContainer.innerHTML = "";

    // Render the selected posts
    randomPosts.forEach(post => {
      const postElement = document.createElement("div");
      postElement.className = "post";

      const imageUrl = post.image || 'default-image-path.jpg';
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
            <div class="d-flex flex-wrap g-5 align-items-center text-muted small mb-2">
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

      postContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    postContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  } finally {
    // Hide the spinner and show the posts container
    spinner.classList.remove("spinner-show");
    spinner.classList.add("spinner-hidden");
    postContainer.style.display = "block";
  }
}



// Call fetchPosts on page load to display all posts
fetchPosts();



function detectTagging(event, inputId) {
  const input = document.getElementById(inputId);
  const atIndex = input.value.lastIndexOf('@');
  if (atIndex !== -1) {
    const fullNameFragment = input.value.substring(atIndex + 1);
    fetchUsers(fullNameFragment, inputId);
  } else {
    document.getElementById(`userSuggestions-${inputId}`).style.display = 'none';
  }
}

function fetchUsers(fullNameFragment, inputId) {
  const accessToken = localStorage.getItem('accessToken');
  if (!token) {
    showNotificationCenter(
      "Please sign up or log in to tag a reader.",
      "warning"
    );
    return;
  }

  fetch(`https://agapelove-medlab-ms.onrender.com/api/user/search?search=${fullNameFragment}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    credentials: 'include', 
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(users => {
      displayUserSuggestions(users, inputId);
    })
    .catch(error => console.error('Error fetching users:', error));

}



// Display user suggestions in the dropdown
function displayUserSuggestions(users, inputId) {
  if (!Array.isArray(users)) {
    console.error('Expected an array but got:', users);
    return;
  }

  const suggestionsContainer = document.getElementById(`userSuggestions-${inputId}`);
  suggestionsContainer.innerHTML = users.map(user => `
      <div class="suggestion" onclick="selectUser('${user._id}', '${user.fullName}', '${inputId}')">${user.fullName}</div>
  `).join('');
  suggestionsContainer.style.display = 'block';

  const inputElement = document.getElementById(inputId);
  const rect = inputElement.getBoundingClientRect();
  suggestionsContainer.style.top = `${rect.bottom + window.scrollY}px`;
  suggestionsContainer.style.left = `${rect.left + window.scrollX}px`;
}




// Select a user to tag
function selectUser(userId, fullName, inputId) { 
  const input = document.getElementById(inputId);
  const atIndex = input.value.lastIndexOf('@');
  input.value = input.value.substring(0, atIndex) + `@${fullName} `;
  document.getElementById(`userSuggestions-${inputId}`).style.display = 'none';
}

function parseTags(content) {
  const taggedUsers = [];
  const regex = /@([\w\s]+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    taggedUsers.push(match[1].trim());  
  }
  return taggedUsers;
}

function renderCommentWithTags(content) {
  return content.replace(/@([\w\s]+)/g, function (match, fullName) {
    const fullNameParts = fullName.split(' ');
    const styledfullName = fullNameParts.slice(0, 2).join(' ');
    
    return `<span class="tagged-fullName">@${styledfullName}</span>  ${fullNameParts.slice(2).join(' ')}`;
  });
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
      const response = await fetch('https://agapelove-medlab-ms.onrender.com/api/posts/topHeadlines');
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
      const response = await fetch('https://agapelove-medlab-ms.onrender.com/api/posts/topHeadlines');
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
    const response = await fetch("https://agapelove-medlab-ms.onrender.com/api/posts/trending");
    const trendingPosts = await response.json();

    // Log the fetched posts to the console
    console.log("Fetched Trending Posts:", trendingPosts);

    if (trendingPosts.length === 0) {
      // Show a message if no trending posts are available
      showNotificationBottomLeft('No trending posts available.', 'info');
      menuMegaContent.innerHTML = "<p>No trending posts available.</p>";
    } else {
      trendingPosts.forEach((post, index) => {
        const imageUrl = post.image
          ? `https://agapelove-medlab-ms.onrender.com${post.image}`
          : "default-image-path.jpg"; // Fallback image if none is provided

        const itemHTML = `
          <div class="item item-${index}">
            <a href="/api/posts/post/${post.slug}" class="item-thumbnail optimized category-link" data-category="${post.categories}">
              <img loading="lazy" decoding="async" src="${imageUrl}" alt="${post.title}">
              <i class="fa-solid fa-camera"></i>
            </a>
            <a href="/api/posts/post/${post.slug}" class="item-title category-link"> data-category="${post.categories}"${post.title.slice(0, 60)}...<span style="color: #FF69B4; font-size: 0.65rem; font-style: italic;">Read</span></a>
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
    const response = await fetch("https://agapelove-medlab-ms.onrender.com/api/posts/trending");
    const trendingPosts = await response.json();

    // Log the fetched posts to the console
    console.log("Fetched Trending Posts:", trendingPosts);

    if (trendingPosts.length === 0) {
      menuMegaContent.innerHTML = "<p>No trending posts available.</p>";
    } else {
      trendingPosts.forEach((post, index) => {
        const imageUrl = post.image
          ? `https://agapelove-medlab-ms.onrender.com${post.image}`
          : "default-image-path.jpg"; // Fallback image if none is provided

        const itemHTML = `
          <div class="item item-${index}">
            <a href="/api/posts/post/${post.slug}" class="item-thumbnail optimized category-link" data-category="${post.categories}">
              <img loading="lazy" decoding="async" src="${imageUrl}" alt="${post.title}">
              <i class="fa-solid fa-camera"></i>
            </a>
            <a href="/api/posts/post/${post.slug}" class="item-title category-link" data-category="${post.categories}">${post.title.slice(0, 60)}...<span style="color: #FF69B4; font-size: 0.65rem; font-style: italic;">Read</span></a>
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
        const response = await fetch(`https://agapelove-medlab-ms.onrender.com/api/post/search?term=${encodeURIComponent(searchTerm)}`);
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
      // Show a message if no posts are found
      showNotificationBottomRight("No results found.", 'info');
      resultsContainer.innerHTML = '<p class="noResults">No results found</p>';
      return;
    }

    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('post-item');

      const imageUrl = post.image ? `https://agapelove-medlab-ms.onrender.com${post.image}` : 'default-image-path.jpg';

      postElement.innerHTML = `
        <div class="post-item-image">
          <img src="${imageUrl}" alt="${post.title}" />
        </div>
        <div class="post-item-content">
          <a href="/api/posts/post/${post.slug}" class="category-link" data-category="${post.categories}">${highlightKeyword(post.title, searchTerm)}</a>
          <p>${post.content ? highlightKeyword(post.content.substring(0, 100), searchTerm) : ''}...</p>
          <span>${post.categories || ''} | ${(post.tags && post.tags.join(', ')) || ''}</span>
          <span> | By: ${post.author.fullName || ''} | ${formatPostDate(new Date(post.createdAt))}</span>
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


function alignImage(alignDirection) {
  const img = document.querySelector('img.selected'); // Assuming you have a way to mark the selected image
  if (img) {
      img.classList.remove('float-left', 'float-right'); // Remove any existing alignment classes
      if (alignDirection === 'left') {
          img.classList.add('float-left');
      } else if (alignDirection === 'right') {
          img.classList.add('float-right');
      }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#alignLeftButton').addEventListener('click', () => {
      alignImage('left');
  });

  document.querySelector('#alignCenterButton').addEventListener('click', () => {
    alignImage('center');
});

  document.querySelector('#alignRightButton').addEventListener('click', () => {
      alignImage('right');
  });
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


const subscribeToType = (formId, emailInputId, fullNameInputId, messageId, type, overlayId) => {
  document.getElementById(formId).addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = document.getElementById(emailInputId);
    const fullNameInput = document.getElementById(fullNameInputId);
    const email = emailInput.value;
    const fullName = fullNameInput.value.trim();
    const messageElement = document.getElementById(messageId);
    const overlay = document.getElementById(overlayId);

    // Get selected niches
    const selectedNiches = Array.from(
      document.querySelectorAll(`#${formId} input[type="checkbox"]:checked`)
    ).map((checkbox) => checkbox.value);

    // Validate based on subscription type
    if (type === "Newsletter") {
      if (!fullName || !email || selectedNiches.length === 0) {
        showNotificationCenter("Please enter a valid fullName, email, and select at least one interest.", 'warning');
        // messageElement.textContent = "Please enter a valid fullName, email, and select at least one interest.";
        // messageElement.classList.remove("success");
        // messageElement.classList.add("error");
        setTimeout(() => (messageElement.textContent = ""), 3000);
        return;
      }
    } else {
      if (!email || !fullName) {
        showNotificationCenter("Please enter a valid email and fullName.", 'warning');
        // messageElement.classList.remove("success");
        // messageElement.classList.add("error");
        setTimeout(() => (messageElement.textContent = ""), 3000);
        return;
      }
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(fullName)) {
      showNotificationCenter("Invalid fullName format. Please use only spaces, letters and numbers.", 'error');
      // messageElement.textContent = "Invalid fullName format. Please use only spaces, letters and numbers.";
      // messageElement.classList.remove("success");
      // messageElement.classList.add("error");
      setTimeout(() => (messageElement.textContent = ""), 3000);
      return;
    }


    // API call to subscribe
    fetch("https://agapelove-medlab-ms.onrender.com/api/newsLetter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email, type, niches: selectedNiches }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showNotificationCenter(`Thank you, ${fullName}, for subscribing to ${type}!`, 'success');
          // messageElement.textContent = `Thank you, ${fullName}, for subscribing to ${type}!`;
          // messageElement.classList.remove("error");
          // messageElement.classList.add("success");

          // Clear the form and close the overlay after success
          setTimeout(() => {
            messageElement.textContent = "";
            emailInput.value = "";
            fullNameInput.value = ""; // Clear fullName
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
subscribeToType("newsletter-form", "newsletter-email", "newsletter-fullName", "newsletter-message", "Newsletter", "newsletter-overlay");
subscribeToType("updates-form", "updates-email", "updates-fullName", "updates-message", "Updates", "updates-overlay");

document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'openPostSignupModal') {
    document.getElementById('signupPostModal').style.display = 'block';
    saveRedirectUrl();
  }

  if (e.target && e.target.id === 'openPostLoginModal') {
    document.getElementById('loginPostModal').style.display = 'block';
    saveRedirectUrl();
  }
});


function saveRedirectUrl() {
  const currentUrl = window.location.href;
  localStorage.setItem('redirectUrl', currentUrl);
}

document.getElementById("closeLoginPostModal").onclick = function () {
  document.getElementById("loginPostModal").style.display = "none";
};
document.getElementById("closeSignupPostModal").onclick = function () {
  document.getElementById("signupPostModal").style.display = "none";
};



// Base API URL
const POST_BASE_URL = "https://agapelove-medlab-ms.onrender.com/api/auth";

// // Handle Login
document.getElementById("loginPostForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageElement = document.getElementById('message');
  messageElement.textContent = '';

  if (!email || !password) {
    messageElement.textContent = "Email and password are required";
    messageElement.style.color = 'red';
    return;
  }

  try {
    const response = await fetch(`${POST_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Assume successful login
      const redirectUrl = localStorage.getItem('redirectUrl') || 'index.html';
      localStorage.removeItem('redirectUrl'); // Clear redirect URL
      clearPostLogin();
      window.location.href = redirectUrl; // Redirect to the saved URL
    } else {
      const data = await response.json();
      messageElement.textContent = data.message || "Invalid email or password.";
      messageElement.style.color = 'red';
    }
  } catch (error) {
    console.error("Login error:", error);
    messageElement.textContent = "An error occurred while logging in. Please try again.";
    messageElement.style.color = 'red';
  }
});



document.getElementById('signupPostForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const messageElement = document.getElementById('signup-message');
  messageElement.textContent = '';

  const fullName = document.getElementById('signupfullName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  if (!fullName || !email || !password || !document.getElementById('agree').checked) {
    messageElement.textContent = 'All fields are required!';
    messageElement.style.color = 'red';
    return;
  }

  try {
    const response = await fetch('https://agapelove-medlab-ms.onrender.com/api/reader', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });

    if (response.ok) {
      const redirectUrl = localStorage.getItem('redirectUrl') || '/';
      localStorage.removeItem('redirectUrl'); // Clear redirect URL
      clearPostSignup(); // Clear form fields
      window.location.href = redirectUrl; // Redirect to the saved URL
    } else {
      const errorData = await response.json();
      messageElement.textContent = `Registration failed: ${errorData.message || 'Error'}`;
      messageElement.style.color = 'red';
    }
  } catch (error) {
    console.error("Signup error:", error);
    messageElement.textContent = "An error occurred while signing up.";
    messageElement.style.color = 'red';
  }
});


// // Helper function to clear form fields
function clearPostLogin() {
  const messageElement = document.getElementById('message'); // Define it here as well
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  messageElement.textContent = '';
}

function clearPostSignup() {
  const messageElement = document.getElementById('message'); // Define it here as well
  document.getElementById('fullName').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  messageElement.textContent = '';
}



document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('https://agapelove-medlab-ms.onrender.com/api/posts/layout');
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


const apiBaseUrl = window.location.hostname.includes("localhost") 
  ? "http://localhost:3173"
  : "https://agapelove-medlab-ms.onrender.com";

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
                  `<a style="color: #3368c6;" class="post-label-a" href="/posts?category=${encodeURIComponent(
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
