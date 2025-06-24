document.addEventListener("DOMContentLoaded", () => {
    function getCookie(name) {
      const cookies = document.cookie.split("; ");
      for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) return decodeURIComponent(value);
      }
      return null;
    }
  
    const accessToken = getCookie("accessToken");
    const role = localStorage.getItem("userRole");
    const refreshToken = getCookie("refreshToken");
  
    if (!accessToken || !role === "Patient") {
      console.log("No valid access token found. Redirecting to login...");
      window.location.href = "/patient-login";
    } else {
      console.log("User is authenticated. Access granted.");
    }
  });

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


async function fetchUserProfile() {
    try {
        const token = localStorage.getItem('accessToken'); // Assuming JWT stored here

        const response = await fetch('http://localhost:3270/api/user/profile/{userId}', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Ensure correct token format
            },
        });

        if (response.ok) {
            const userData = await response.json();
            const imageUrl = userData.imageUrl ? `http://localhost:3270${userData.imageUrl}` : 'img/ImageUnavailable.jpeg';
            const labPatientId = userData.labPatientId;
            console.log("User: " + userData);
            console.log("User: " + userData.emergencyContact?.name);


            // Dynamically update the avatar based on user type
            if (userData.role === 'Patient') {
                document.getElementById('nav-current-image').src = imageUrl || 'img/ImageUnavailable.jpeg';
                document.getElementById('current-image').src = imageUrl || 'img/ImageUnavailable.jpeg';
                document.getElementById('username').textContent = userData.fullName || 'Anonymous';
                document.getElementById('userRole').textContent = userData.role;
                document.getElementById('userEmail').textContent = userData.email;
                document.getElementById('userPhone').textContent = userData.phone;
                document.getElementById('userAddress').textContent = userData.address;
                document.getElementById('userGender').textContent = userData.gender;
                document.getElementById('userStaffId').textContent = userData.labPatientId;

                // Basic Info
                document.getElementById("userDateOfBirth").textContent = new Date(userData.dateOfBirth).toLocaleDateString();
                document.getElementById("bloodGroup").textContent = userData.bloodGroup;
                document.getElementById("registeredBy").textContent = userData.registeredBy;
                document.getElementById("status").textContent = userData.status;
                document.getElementById("lastLogin").textContent = userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : "Never";
                document.getElementById("registrationDate").textContent = new Date(userData.registrationDate).toLocaleDateString();

                // Emergency Contact
                document.getElementById("emergencyContactName").textContent = userData.emergencyContact?.name || "N/A";
                document.getElementById("emergencyContactPhone").textContent = userData.emergencyContact?.phone || "N/A";
                document.getElementById("emergencyContactRelationship").textContent = userData.emergencyContact?.relationship || "N/A";
            } else if (userData.role === 'Admin') {
                document.getElementById('nav-current-image').src =
                    userData.imageUrl || './images/default-user-icon.png';
                document.getElementById('current-image').src =
                    userData.imageUrl || './images/default-user-icon.png';
                document.getElementById('username').textContent = userData.fullName || 'Anonymous';
                document.getElementById('userRole').textContent = userData.role;
                document.getElementById('userEmail').textContent = userData.email;
                document.getElementById('userPhone').textContent = userData.phone;
                document.getElementById('userAddress').textContent = userData.address;
                document.getElementById('userGender').textContent = userData.gender;
                document.getElementById('userStaffId').textContent = userData.staffId;
            }

            viewPatient(labPatientId)

        } else {
            console.error('Failed to fetch user profile:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

fetchUserProfile();


async function viewPatient(labPatientId) {
    console.log("Fetching patient with ID:", labPatientId);
    try {
        const response = await fetch(`http://localhost:3270/api/user/details/${labPatientId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            credentials: "include",
        });
        const patient = await response.json();

        // Populate tables
        populateTable("testResultsList", patient.testResults, "testResults");
        populateTable("appointmentsList", patient.appointments, "appointments");
        populateTable("notificationsList", patient.notifications, "notifications");
        populateTable("messagesList", patient.messages, "messages");
        populateTable("medicalRecordsList", patient.medicalRecords, "medicalRecords");

        // Show Modal
        // new bootstrap.Modal(document.getElementById("patientDetailsModal")).show();
    } catch (error) {
        console.error("Error fetching patient details:", error);
    }
}


const LMS_BASE_URL = "https://agapelove-medlab-ms.onrender.com/api/documents";

function populateTable(elementId, items, type = "text") {
    const tableBody = document.getElementById(elementId);
    tableBody.innerHTML = items.length
        ? items.map(item => {
            const filePath = `${item.resultFile}`;
            const fileName = getFileName(filePath);
            // const fileUrl = `http://localhost:3270/${file.resultFile.replace(/\\/g, "/")}`;
            const fileUrl = `${LMS_BASE_URL}/results/download/${fileName}`;
            if (type === "testResults") {
                return `<tr>
                <td>${item.sampleID?.sampleId}</td>
                    <td>${new Date(item.dateTested).toLocaleDateString()}</td>
                    <td>${item.diagnosis || "Not Diagnosed"}</td>
                    <td>${item.prescription || "No Prescription"}</td>
                    <td>${getStatusBadge(item.status)}</td>
                    <td>${item.uploadedBy?.fullName || "Unknown"}</td>
                    <td>
                        <a href="${fileUrl}" download class="btn btn-sm btn-primary">
                            <i class="bi bi-download"></i>
                        </a>
                    </td>
                </tr>`;
            }

            if (type === "appointments") {
                return `<tr>
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                    <td>${item.time}</td>
                    <td>${item.doctor?.fullName || "N/A"}</td>
                    <td><span class="badge bg-${item.status === 'Confirmed' ? 'success' : 'warning'}">${item.status}</span></td>
                </tr>`;
            }
            if (type === "notifications") {
                return `<tr>
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                    <td>${item.message}</td>
                </tr>`;
            }
            if (type === "messages") {
                return `<tr>
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                    <td>${item.from?.fullName || "Unknown"}</td>
                    <td>${item.message}</td>
                </tr>`;
            }
            if (type === "medicalRecords") {
                return `<tr>
                    <td>${item.sampleId}</td>
                    <td class="cell"><span class="badge bg-${getStatusColor(item.status)}">${item.status}</span></td>
                    <td>${item.testRun}</td>
                    <td>${new Date(item.collectionDate).toLocaleDateString()}</td>
                    <td>${item.registeredBy}</td>
                </tr>`;
            }
            return "";
        }).join("")
        : `<tr><td colspan="4" class="text-muted text-center">No records found</td></tr>`;
}

function getStatusBadge(status) {
    let colorClass;
    switch (status) {
        case "Doctor Review":
            colorClass = "badge bg-warning";
            break;
        case "Processed":
            colorClass = "badge bg-success";
            break;
        default:
            colorClass = "badge bg-secondary";
    }
    return `<span class="${colorClass}">${status}</span>`;
}

function getFileName(filePath) {
    return filePath.split('/').pop();
}

function getStatusColor(status) {
    return status === "Pending" ? "warning" : status === "Processed" ? "success" : "info";
}


document.getElementById('change-image-btn').addEventListener('click', () => {
    document.getElementById('image-upload-input').click(); // Open file picker
});

document.getElementById('image-upload-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3270/api/user/upload-image', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            showNotificationBottomLeft('Image changed successfully!');
            const userData = await response.json();

            // Update the profile image
            document.getElementById('current-image').src = userData.imageUrl || 'images/default-user-icon.png';
        } else {
            showNotificationBottomLeft('Failed to upload image.');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        showNotificationBottomLeft('An error occurred while uploading the image.');
    }
});



document.querySelectorAll('.edit-btn[data-type="text"]').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        const field = this.getAttribute('data-field');
        const dataElement = document.getElementById(`user${capitalize(field)}`);
        const currentValue = dataElement.textContent.trim();

        if (this.textContent === "Change") {
            // Store the original value
            dataElement.setAttribute("data-original", currentValue);

            // Convert to input field
            const inputType = field === "password" ? "password" : "text";
            dataElement.innerHTML = `<input type="${inputType}" class="form-control" id="input-${field}" value="${currentValue}">`;

            this.textContent = "Cancel";  // Initially change button to 'Cancel'
            this.classList.remove('app-btn-secondary');
            this.classList.add('app-btn-warning');

            // Track changes in the input field
            const inputField = document.getElementById(`input-${field}`);
            inputField.focus(); // Automatically focus on the input field

            inputField.addEventListener("input", () => {
                if (inputField.value === currentValue) {
                    this.textContent = "Cancel";
                    this.classList.replace('app-btn-primary', 'app-btn-warning');
                } else {
                    this.textContent = "Save";
                    this.classList.replace('app-btn-warning', 'app-btn-primary');
                }
            });

            // Close input if clicked outside
            document.addEventListener("click", function closeEditor(event) {
                if (!dataElement.contains(event.target) && event.target !== button) {
                    resetField(dataElement, button);
                    document.removeEventListener("click", closeEditor);
                }
            });

        } else if (this.textContent === "Save") {
            // Get new value
            const newValue = document.getElementById(`input-${field}`).value.trim();

            updateUserData(field, newValue)
                .then(response => {
                    if (response.success) {
                        dataElement.textContent = newValue;
                        resetButton(button);
                    } else {
                        showNotificationBottomLeft("Failed to update!");
                    }
                })
                .catch(error => console.error("Update Error:", error));

        } else if (this.textContent === "Cancel") {
            resetField(dataElement, button);
        }
    });
});

// Function to reset the field to its original state
function resetField(dataElement, button) {
    dataElement.textContent = dataElement.getAttribute("data-original");
    resetButton(button);
}

// Function to reset the button back to "Change"
function resetButton(button) {
    button.textContent = "Change";
    button.classList.remove('app-btn-warning', 'app-btn-primary');
    button.classList.add('app-btn-secondary', 'btn-sm');
}

// Function to send updated data to the backend
function updateUserData(field, value) {
    return fetch('http://localhost:3270/api/user/update-profile', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'credentials': 'include'
        },
        body: JSON.stringify({ [field]: value })
    }).then(res => res.json());
}

// Function to capitalize first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


document.querySelectorAll('.edit-btn[data-type="password"]').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        const dataElement = document.getElementById("userPassword");

        if (this.textContent === "Change") {
            dataElement.innerHTML = `
                <input type="password" class="form-control mb-1" id="new-password" placeholder="New Password">
                <input type="password" class="form-control" id="confirm-password" placeholder="Confirm Password">
            `;

            this.textContent = "Cancel";
            this.classList.replace('app-btn-secondary', 'app-btn-danger');

            const inputs = dataElement.querySelectorAll("input");
            inputs.forEach(input => {
                input.addEventListener("input", () => {
                    const newPassword = document.getElementById("new-password").value;
                    const confirmPassword = document.getElementById("confirm-password").value;

                    if (newPassword && confirmPassword && newPassword === confirmPassword) {
                        this.textContent = "Save";
                        this.classList.replace('app-btn-danger', 'app-btn-primary');
                    } else {
                        this.textContent = "Cancel";
                        this.classList.replace('app-btn-primary', 'app-btn-danger');
                    }
                });
            });

        } else if (this.textContent === "Save") {
            const newPassword = document.getElementById("new-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (newPassword !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            updateUserPassword(newPassword)
                .then(response => {
                    if (response.success) {
                        dataElement.textContent = "••••••••";
                        resetButton(button);
                        alert("Password updated successfully!");
                    } else {
                        alert("Failed to update password.");
                    }
                })
                .catch(error => console.error("Update Error:", error));

        } else if (this.textContent === "Cancel") {
            dataElement.textContent = "••••••••";
            resetButton(button);
        }
    });
});

function updateUserPassword(newPassword) {
    return fetch('http://localhost:3270/api/user/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ newPassword })
    }).then(res => res.json());
}

function resetButton(button) {
    button.textContent = "Change";
    button.classList.replace('app-btn-danger', 'app-btn-secondary');
    button.classList.remove('app-btn-primary');
}


document.getElementById("viewMoreBtn").addEventListener("click", function () {
    fetch('http://localhost:3270/api/user/login-history', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const loginHistoryList = document.getElementById("loginHistoryList");
                loginHistoryList.innerHTML = data.history.map(log => `
                <li class="list-group-item">
                    <strong>${log.timestamp}</strong> - ${log.ipAddress}
                </li>
            `).join('');

                let modal = new bootstrap.Modal(document.getElementById("lastLoginModal"));
                modal.show();
            } else {
                showNotificationTopRight("Failed to fetch login history.", 'error');
            }
        })
        .catch(error => console.error("Error fetching login history:", error));
});




