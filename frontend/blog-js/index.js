
var backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});



// promote advert message anime displayer section
document.addEventListener("DOMContentLoaded", function () {
    const welcomeMessage = document.getElementById("welcome-message");

    // Function to show text letter by letter
    function showText(text, delay, callback) {
        let index = 0;
        function addChar() {
            if (index < text.length) {
                welcomeMessage.textContent += text[index];
                index++;
                setTimeout(addChar, delay);
            } else if (callback) {
                callback();
            }
        }
        addChar();
    }

    // Function to hide text letter by letter
    function hideText(delay, callback) {
        let index = welcomeMessage.textContent.length;
        function removeChar() {
            if (index > 0) {
                welcomeMessage.textContent = welcomeMessage.textContent.slice(0, index - 1);
                index--;
                setTimeout(removeChar, delay);
            } else if (callback) {
                callback();
            }
        }
        removeChar();
    }

    // Function to alternate messages with specified durations
    function alternateMessages() {
        const firstMessage = "Do you wish to grow your business...";
        const secondMessage = "Promote your brand here";
        const firstMessageDuration = 4000; // Duration first message stays visible (in milliseconds)
        const secondMessageDuration = 10000; // Duration second message stays visible (in milliseconds)
        const charDelay = 100; // Delay between each character (in milliseconds)

        function showFirstMessage() {
            showText(firstMessage, charDelay, function () {
                setTimeout(function () {
                    hideText(charDelay, showSecondMessage);
                }, firstMessageDuration);
            });
        }

        function showSecondMessage() {
            showText(secondMessage, charDelay, function () {
                setTimeout(function () {
                    hideText(charDelay, showFirstMessage);
                }, secondMessageDuration);
            });
        }

        showFirstMessage();
    }

    // Start alternating messages
    alternateMessages();
});


// Qoutes slide container 
document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector('.quotes-slider');
    const slides = document.querySelectorAll('.quote-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;

    function moveSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(moveSlide, 5000);
});


// Recent Replies Random div js code funtionality

document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const replies = document.querySelectorAll('.reply');
    // let currentRandomIndex = 0;
    // const randomHeadlines = [
    // ];

    // Tab click event
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Like and dislike click events
    replies.forEach(reply => {
        reply.querySelector('.comment-icon').addEventListener('click', () => {
            reply.querySelector('.reply-box').classList.toggle('active');
        });
        reply.querySelector('.like-icon').addEventListener('click', () => {
            let likeCount = parseInt(reply.querySelector('.like-count').innerText);
            reply.querySelector('.like-count').innerText = likeCount + 1;
        });
        reply.querySelector('.dislike-icon').addEventListener('click', () => {
            let dislikeCount = parseInt(reply.querySelector('.dislike-count').innerText);
            reply.querySelector('.dislike-count').innerText = dislikeCount + 1;
        });
    });

    // Initial display of recent tab
    document.querySelector('.tab[data-tab="recent"]').click();

    // Handle comment posting
    document.querySelectorAll('.post-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const textarea = event.target.previousElementSibling;
            if (textarea.value.trim()) {
                alert('Your comment: ' + textarea.value.trim());
                textarea.value = '';
            } else {
                alert('Please enter a comment.');
            }
        });
    });
});






// Subscribe form validation js code here

// document.getElementById('subscribe-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const emailInput = document.getElementById('email');
//     const email = emailInput.value;
//     const messageDiv = document.getElementById('message');
    
//     fetch('https://script.google.com/macros/s/AKfycby_VO7eEbjj7TOf6EIOl-G-tSnGqMQVeYQjcB9Bd4CdQ9Uj-hD1cyokxe4iMYGqb3ld6g/exec', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `email=${encodeURIComponent(email)}`
//     })
//     .then(response => response.text())
//     .then(data => {
//         if (data === 'Success') {
//             messageDiv.textContent = 'Subscribed successfully!';
//             messageDiv.style.color = 'green';
//             emailInput.value = ''; // Clear the email input field

//             // Hide the message after 3 seconds
//             setTimeout(() => {
//                 messageDiv.textContent = '';
//             }, 3000);
//         } else {
//             messageDiv.textContent = 'Subscription failed. Please try again.';
//             messageDiv.style.color = 'red';
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         messageDiv.textContent = 'An error occurred. Please try again.';
//         messageDiv.style.color = 'red';
//     });
// });



// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const response = await fetch('/api/posts/trending');
//     const trendingPosts = await response.json();

//     const menuMegaContent = document.querySelector('.menu-mega-content-label');
//     menuMegaContent.innerHTML = ''; // Clear any existing content

//     trendingPosts.forEach((post, index) => {
//       const itemHTML = `
//         <div class="item item-${index}">
//           <a href="/postPage?id=${post._id}" class="item-thumbnail optimized">
//             <img loading="lazy" decoding="async" src="${post.image}" alt="${post.title}">
//             <i class="gi-solid gi-camera"></i>
//           </a>
//           <a href="/postPage?id=${post._id}" class="item-title">${post.title}</a>
//           <div class="clear"></div>
//         </div>
//       `;
//       menuMegaContent.insertAdjacentHTML('beforeend', itemHTML);
//     });
//   } catch (error) {
//     console.error('Error fetching trending posts:', error);
//   }
// });



// Get the dropdown button and content
const dropdownBtn = document.querySelector('.sub-dropdown-btn');
const dropdownContent = document.getElementById('newsletter-niches');

// Toggle the dropdown visibility when the button is clicked
dropdownBtn.addEventListener('click', function() {
    dropdownContent.style.display = dropdownContent.style.display === 'flex' ? 'none' : 'flex';
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function(event) {
    if (!event.target.matches('.sub-dropdown-btn') && !event.target.matches('.sub-dropdown-content') && !event.target.matches('.sub-dropdown-content *')) {
        dropdownContent.style.display = 'none';
    }
});








// document.addEventListener("DOMContentLoaded", function() {
//     const viewCountElement = document.getElementById("view-count");
//     let viewCount = parseInt(localStorage.getItem("viewCount")) || parseInt(viewCountElement.textContent);
    
//     // Update the view count on the page
//     viewCountElement.textContent = viewCount;
    
//     // Increment the view count every half second
//     setInterval(() => {
//         viewCount += 1;
//         viewCountElement.textContent = viewCount;
//         localStorage.setItem("viewCount", viewCount);
//     }, 7000);
// });

// tickerText.style.animationDuration = `${animationDuration}s`;


// let prevScrollpos = window.pageYOffset;
//         window.onscroll = function() {
//             const currentScrollPos = window.pageYOffset;
//             const header = document.querySelector('.small-screen-header');
//             if (prevScrollpos > currentScrollPos) {
//                 header.style.top = "0";
//             } else {
//                 header.style.top = "-70px";
//             }
//             prevScrollpos = currentScrollPos;
//         }
