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
