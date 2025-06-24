document.addEventListener("DOMContentLoaded", function () {
    const appointmentForm = document.getElementById("appointmentForm");

    appointmentForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        // Collect input values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("mail").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const service = document.getElementById("service").value;
        const preferredDate = document.getElementById("preferredDate").value;
        const preferredTime = document.getElementById("preferredTime").value;
        const appointmentType = document.getElementById("appointmentType").value;
        const reason = document.getElementById("message").value.trim();

        // Basic validation
        if (!name || !email || !mobile || !service || !preferredDate || !preferredTime || !appointmentType) {
            showMessage("All fields are required!", "danger");
            return;
        }

        // Create an object with form data
        const appointmentData = {
            name,
            email,
            mobile,
            service,
            preferredDate,
            preferredTime,
            appointmentType,
            reason
        };

        showLoading();

        try {
            // Send request to the server
            const response = await fetch("https://agapelove-medlab-ms.onrender.com/api/appointments/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointmentData)
            });

            const result = await response.json();

            if (response.ok) {
                setTimeout(() => {
                    hideLoading();
                    showSuccessMessage();
                    showMessage("Appointment request submitted successfully! You will receive an email confirmation.", "success");
                    appointmentForm.reset(); // Clear form
                }, 2000); 
            } else {
                hideLoading();
                showMessage(result.error || "Something went wrong. Please try again.", "danger");
            }
        } catch (error) {
            hideLoading();
            console.error("Error:", error);
            showMessage("Server error. Please try again later.", "danger");
        }
    });

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
});

function showLoading() {
    const loadingIndicator = document.getElementById('gloadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('d-none');
    }
}

function hideLoading() {
    const loadingIndicator = document.getElementById('gloadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('d-none');
    }
}

function showSuccessMessage() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        const modal = new bootstrap.Modal(successModal);
        modal.show();
    }
}



document.addEventListener("DOMContentLoaded", function () {
    const testimonialContainer = document.getElementById("testimonialContainer");
    
    
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
                        <img class="flex-shrink-0" src="${reviewImage || 'image/default-user-icon.png'}" alt="User Image" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
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

    fetchReviews();
});
