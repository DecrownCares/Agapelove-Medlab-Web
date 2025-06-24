document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const notificationMessage = document.getElementById("notification-message");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validate the form
        if (!name || !email || !subject || !message) {
            showMessage("All fields marked with * are required!", "danger");
            return;
        }

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            showMessage("Please enter a valid email address!", "danger");
            return;
        }

        // Create form data object
        const formData = { name, email, subject, message };

        // Show loading indicator
        showLoading();

        // Send form data via Fetch API
        fetch("https://agapelove-medlab-ms.onrender.com/api/contact/submit-contact-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then(async (response) => {
                hideLoading(); // Hide loading indicator
                if (response.ok) {
                    // Show success message & reset form
                    showMessage("Your message has been sent successfully.", "success");
                    contactForm.reset();
                    showSuccessMessage();
                } else {
                    const errorText = await response.text();
                    showMessage("Error sending message: " + errorText, "danger");
                    console.error("Server Response:", response.status, errorText);
                }
            })
            .catch((error) => {
                hideLoading();
                showMessage("Network error. Please try again later.", "danger");
                console.error("Fetch Error:", error);
            });
    });

    function showMessage(message, type) {
        notificationMessage.innerHTML = ""; // Clear previous messages
        const messageBox = document.createElement("div");
        messageBox.className = `alert alert-${type} mt-3`;
        messageBox.innerHTML = message;
        notificationMessage.appendChild(messageBox);

        // Remove message after 5 seconds
        setTimeout(() => messageBox.remove(), 5000);
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
});
