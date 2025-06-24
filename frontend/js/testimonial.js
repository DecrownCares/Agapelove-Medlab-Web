document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.getElementById("reviewForm");
    const testimonialContainer = document.getElementById("testimonialContainer");

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const review = document.getElementById("review").value.trim()
        const reviewType = document.getElementById("reviewType").value.trim();
        const imageInput = document.getElementById("image").files[0];

        if (!name || !email || !review || !reviewType) {
            showMessage("All fields marked with * are required!", "error");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            showMessage("Please enter a valid email address!", "error");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("review", review);
        formData.append("reviewType", reviewType);
        if (imageInput) {
            formData.append("image", imageInput);
        }

        showLoading();

        fetch("https://agapelove-medlab-ms.onrender.com/api/reviews/submit-review", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                hideLoading();
                if (data.success) {
                    showSuccessMessage();
                    showMessage("Your review has been submitted successfully!", "success");
                    addTestimonial(name, review, reviewType, data.imageURL || "images/default-user-icon.png");
                    reviewForm.reset();
                } else {
                    showMessage("There was an error submitting your review. Please try again.", "error");
                }
            })
            .catch(error => {
                hideLoading();
                console.error("Error submitting review:", error);
                showMessage("An unexpected error occurred. Please try again later.", "error");
            });
    });

    function addTestimonial(name, review, reviewType, imageURL) {
        const testimonialHTML = `
            <div class="testimonial-item">
                <div class="icon-box-primary mb-4">
                    <i class="bi bi-chat-left-quote text-dark"></i>
                </div>
                <p><strong>${reviewType}</strong></p>
                <p class="fs-5 mb-4">${review}</p>
                <div class="d-flex align-items-center">
                    <img class="flex-shrink-0" src="${imageURL}" alt="User Image" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                    <div class="ps-3">
                        <h5 class="mb-1">${name}</h5>
                        <span class="text-primary">New Review</span>
                    </div>
                </div>
            </div>
        `;
    
        testimonialContainer.innerHTML += testimonialHTML;
    
        // Optional: Refresh Owl Carousel
        $(".testimonial-carousel").owlCarousel("destroy");
        initializeOwlCarousel();
    }
    
    
    function fetchReviews() {
        fetch("https://agapelove-medlab-ms.onrender.com/api/reviews/get-reviews")
            .then(response => response.json())
            .then(data => {
                renderReviews(data);
            })
            .catch(error => console.error("Error fetching reviews:", error));
    }
    
    function renderReviews(reviews) {
        testimonialContainer.innerHTML = ""; // Clear previous content
    
        if (reviews.length === 0) {
            testimonialContainer.innerHTML = "<p class='text-center'>No reviews yet.</p>";
            return;
        }
    
        reviews.forEach(review => {
            const reviewImage = `https://agapelove-medlab-ms.onrender.com${review.image}`
            const testimonialHTML = `
                <div class="testimonial-item">
                    <div class="icon-box-primary mb-4">
                        <i class="bi bi-chat-left-quote text-dark"></i>
                    </div>
                    <p><strong>${review.reviewType}</strong></p>
                    <p class="fs-5 mb-4">${review.review}</p>
                    <div class="d-flex align-items-center">
                        <img class="flex-shrink-0" src="${reviewImage || 'img/default-user-icon.png'}" alt="User Image" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                        <div class="ps-3">
                            <h5 class="mb-1">${review.name}</h5>
                        </div>
                    </div>
                </div>
            `;
            testimonialContainer.innerHTML += testimonialHTML;
        });
    
        // Destroy previous Owl Carousel instance and reinitialize
        $(".testimonial-carousel").owlCarousel("destroy");
        initializeOwlCarousel();
    }
    
    function initializeOwlCarousel() {
        $(".testimonial-carousel").owlCarousel({
            loop: true,
            margin: 30,
            smartSpeed: 1000,
            nav: true,
            navText : [
                '<i class="bi bi-arrow-left"></i>',
                '<i class="bi bi-arrow-right"></i>'
            ],
            dots: true,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            responsive: {
                0: { items: 1 },
                768: { items: 1 },
                1024: { items: 1 }
            }
        });
    }
    

    function showMessage(message, type) {
        const messageBox = document.createElement("div");
        messageBox.className = `alert alert-${type} mt-3`;
        messageBox.innerHTML = message;

        const formContainer = document.querySelector(".col-lg-6");
        formContainer.appendChild(messageBox);

        setTimeout(() => {
            messageBox.remove();
        }, 5000);
    }

    function showLoading() {
        const loadingIndicator = document.getElementById("gloadingIndicator");
        if (loadingIndicator) loadingIndicator.classList.remove("d-none");
    }

    function hideLoading() {
        const loadingIndicator = document.getElementById("gloadingIndicator");
        if (loadingIndicator) loadingIndicator.classList.add("d-none");
    }

    function showSuccessMessage() {
        const successModal = document.getElementById("successModal");
        if (successModal) {
            const modal = new bootstrap.Modal(successModal);
            modal.show();
        }
    }

    fetchReviews();
});
