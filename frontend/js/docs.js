const LMS_BASE_URL = "https://agapelove-medlab-ms.onrender.com/api/documents";

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
    const refreshToken = getCookie("refreshToken");
  
    if (!accessToken) {
      console.log("No valid access token found. Redirecting to login...");
      window.location.href = "/login.html";
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


document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.querySelector(".app-btn-primary"); // Upload button
    const fileInput = document.getElementById("fileInput");
    const uploadModal = new bootstrap.Modal(document.getElementById("uploadModal"));
    const confirmUploadButton = document.getElementById("confirmUpload");

    // Trigger file selection
    uploadButton.addEventListener("click", function (event) {
        event.preventDefault();
        fileInput.click();
    });

    // Show modal after file selection
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById("selectedFileName").textContent = file.name;
            document.getElementById("selectedFileSize").textContent = (file.size / 1024).toFixed(2) + " KB";
            uploadModal.show();
        }
    });

    // Confirm Upload
    confirmUploadButton.addEventListener("click", function () {
        const file = fileInput.files[0];
        const description = document.getElementById("fileDescription").value;
        if (file) {
            uploadFile(file, description);
            uploadModal.hide();
        }
    });

    // Function to upload file
    async function uploadFile(file, description) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", description);

        showLoading();

        try {
            const response = await fetch("http://localhost:3270/api/documents/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: formData, // No need to set Content-Type manually
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();

            if (response.ok) {
                setTimeout(() => {
                    hideLoading();
                    bootstrap.Modal.getInstance(document.getElementById("uploadModal")).hide();
                    showSuccessMessage();
                    setTimeout(() => {
                        fetchFiles();
                    }, 2000);
                }, 2000);
                // location.reload(); // Refresh the page to show the uploaded file
            } else {
                showNotificationTopRight(data.error || "Failed to upload file.", "error");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            showNotificationTopRight("Failed to upload file. Please try again.", "error");
        }
    }
});


function showLoading() {
    document.getElementById('gloadingIndicator').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('gloadingIndicator').classList.add('d-none');
}

function showSuccessMessage() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}


document.addEventListener("DOMContentLoaded", () => {
    fetchResults();

    // Event listeners for search, filter, and sorting
    document.getElementById("search-docs").addEventListener("input", applyFilters);
    document.getElementById("filter-type").addEventListener("change", applyFilters);
    document.getElementById("sort-options").addEventListener("change", applyFilters);
});

// Global file list
let allFiles = [];

// Fetch files from the backend
async function fetchResults() {
    try {
        const response = await fetch("http://localhost:3270/api/user/patient-results", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch results: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging

        let resultsArray = [];

        if (Array.isArray(data.testResults)) {
            resultsArray = data.testResults; // Directly assign if it's already an array
        } else if (typeof data === "object" && data.testResults) {
            resultsArray = Object.values(data.testResults); // Convert to array
        } else {
            console.error("Unexpected data format:", data);
            return;
        }

        allResults = resultsArray;
        renderResults(allResults);
    } catch (error) {
        console.error("Error fetching results:", error);
    }
}

// Apply search, filter, and sorting
function applyFilters() {
    const searchQuery = document.getElementById("search-docs").value.trim().toLowerCase();
    const filterType = document.getElementById("filter-type").value;
    const sortOption = document.getElementById("sort-options").value;

    let filteredFiles = allResults;
    // let filePath = `${file.resultFile}`;
    // let fileName = getFileName(filePath);

    // Search filter (by filename)
    if (searchQuery) {
        filteredFiles = filteredFiles.filter(file => getFileName(file.resultFile).toLowerCase().includes(searchQuery));
    }

    // File type filter
    if (filterType !== "all") {
        filteredFiles = filteredFiles.filter(file => file.testType.includes(testType));
    }

    // Sorting
    switch (sortOption) {
        case "name-asc":
            filteredFiles.sort((a, b) => getFileName(a.resultFile).localeCompare(getFileName(b.resultFile)));
            break;
        case "name-desc":
            filteredFiles.sort((a, b) => getFileName(b.resultFile).localeCompare(getFileName(a.resultFile)));
            break;
        case "date-asc":
            filteredFiles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case "date-desc":
            filteredFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    renderResults(filteredFiles);
}

// Display files dynamically
function renderResults(files) {
    const fileContainer = document.getElementById("file-container");
    fileContainer.innerHTML = "";

    files.forEach(file => {
        if (!file.resultFile || !file.sampleID?.sampleId) {
            console.warn("Skipping file due to missing properties:", file);
            return;
        }

        const filePath = `${file.resultFile}`;
        const fileName = getFileName(filePath);
        // const fileUrl = `http://localhost:3270/${file.resultFile.replace(/\\/g, "/")}`;
        const fileUrl = `${LMS_BASE_URL}/results/${fileName}`;
        const fileExtension = file.resultFile.split('.').pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension);
        const fileTypeIcon = getFileTypeIcon(fileExtension);
        const isPdf = fileExtension === "pdf";

        // Calculate time difference
        const uploadedTime = new Date(file.createdAt);
        const currentTime = new Date();
        const timeDiff = (currentTime - uploadedTime) / (1000 * 60 * 60);
        const isNew = timeDiff <= 24;

        const card = `
            <div class="col-6 col-md-4 col-xl-3 col-xxl-2">
                <div class="app-card app-card-doc shadow-sm h-100">
                    <div class="app-card-thumb-holder p-3">
                        ${isNew ? `<span class="badge bg-success">NEW</span>` : ""}
                        ${isImage ? `<div class="app-card-thumb"><img class="thumb-image" src="${fileUrl}" alt=""></div>` 
                                  : `<span class="icon-holder">${fileTypeIcon}</span>`}
                        <a class="app-card-link-mask" href="${fileUrl}" target="_blank"></a>
                    </div>
                    <div class="app-card-body p-3 has-card-actions">
                        <h4 title="${fileName}" class="app-doc-title truncate mb-0">
                            <a href="${fileUrl}" target="_blank">${fileName}</a>
                        </h4>
                        <div class="app-doc-meta">
                            <ul class="list-unstyled mb-0">
                                <li class="truncate-text"><span class="text-muted">TID:</span> ${file.sampleID?.sampleId}</li>
                                <li><span class="text-muted">Type:</span> ${file.testType}</li>
                                <li><span class="text-muted">Uploaded:</span> ${formatTimeAgo(file.createdAt)}</li>
                            </ul>
                        </div>
                        <div class="app-card-actions">
                            <div class="dropdown">
                                <div class="dropdown-toggle no-toggle-arrow" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </div>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" onclick="openFile('${fileUrl}', '${fileExtension}')">
                                        <i class="bi bi-eye me-2"></i>View</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="shareFile('${fileUrl}', '${fileName}')">
                                        <i class="bi bi-share me-2"></i>Share</a></li>
                                    <li><a class="dropdown-item" href="${LMS_BASE_URL}/results/download/${fileName}" download target="_blank">
                                        <i class="bi bi-download me-2"></i>Download
                                        </a>
                                    </li>
                                    <li style="position: relative;">
                                        <a class="dropdown-item description-link" href="#" onclick="toggleDescription(event, '${file._id}', '${file.diagnosis.replace(/'/g, "\\'")}')">
                                            <i class="bi bi-info-circle me-2"></i>Comment
                                        </a>
                                        <div id="description-card-${file._id}" class="description-card">
                                            <strong>Diagnosis:</strong><br>
                                            <p id="description-text">${file.diagnosis || "Not provided"}</p><br>
                                            <strong>Prescription:</strong><br>
                                            <p id="prescription-text">${file.prescription || "Not provided"}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        fileContainer.innerHTML += card;
    });
}

function forceDownload(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Function to open file with user's preferred viewer
function openFile(fileUrl, fileExtension) {
    if (fileExtension === "pdf") {
        if (navigator.userAgent.toLowerCase().includes("android")) {
            window.open(fileUrl, "_blank"); // Let Android handle PDF viewer selection
        } else {
            const userConfirmed = confirm("Open this file with your preferred PDF viewer?");
            if (userConfirmed) {
                window.location.href = fileUrl;
            }
        }
    } else {
        window.open(fileUrl, "_blank");
    }
}

// Function to share the file via available apps
function shareFile(fileUrl, fileName) {
    if (navigator.share) {
        navigator.share({
            title: "Test Result",
            text: `Check out this test result: ${fileName}`,
            url: fileUrl
        }).catch((error) => console.error("Error sharing:", error));
    } else {
        showNotificationTopRight("Sharing not supported on this device. Copy the URL manually: " + fileUrl, 'info');
    }
}



function getFileName(filePath) {
    return filePath.split('/').pop();
}


// Helper functions
function getFileTypeIcon(type) {
    const icons = {
        "application/pdf": '<i class="fas fa-file-pdf text-danger"></i>',
        "application/msword": '<i class="fas fa-file-word text-primary"></i>',
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": '<i class="fas fa-file-word text-primary"></i>',
        "application/vnd.ms-excel": '<i class="fas fa-file-excel text-success"></i>',
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": '<i class="fas fa-file-excel text-success"></i>',
        "application/vnd.ms-powerpoint": '<i class="fas fa-file-powerpoint text-warning"></i>',
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": '<i class="fas fa-file-powerpoint text-warning"></i>',
        "text/plain": '<i class="fas fa-file-alt text-muted"></i>',
        "application/zip": '<i class="fas fa-file-archive text-secondary"></i>',
        "video/mp4": '<i class="fas fa-file-video text-info"></i>',
        "audio/mpeg": '<i class="fas fa-file-audio text-purple"></i>',
        "default": '<i class="fas fa-file-pdf text-danger"></i>'
    };
    return icons[type] || icons["default"];
}

function formatFileSize(size) {
    if (size < 1024) return size + " B";
    if (size < 1048576) return (size / 1024).toFixed(1) + " KB";
    if (size < 1073741824) return (size / 1048576).toFixed(1) + " MB";
    return (size / 1073741824).toFixed(1) + " GB";
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        "year": 31536000, "month": 2592000, "week": 604800,
        "day": 86400, "hour": 3600, "minute": 60, "second": 1
    };
    for (const unit in intervals) {
        const count = Math.floor(seconds / intervals[unit]);
        if (count > 0) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
}


function toggleDescription(event, fileId, description) {
    event.preventDefault();
    event.stopPropagation(); // Prevent dropdown from closing

    // Get the specific description card for the clicked file
    const descCard = document.getElementById(`description-card-${fileId}`);

    if (!descCard) {
        console.error("Description card element not found!");
        return;
    }

    // Toggle visibility
    const isVisible = descCard.style.display === "block";
    document.querySelectorAll(".description-card").forEach(el => el.style.display = "none"); // Hide others
    if (isVisible) return; // If already visible, just hide it

    // Set description text
    descCard.querySelector("#description-text").textContent = description || "No description available.";

    descCard.style.display = "block";

    // Highlight the active description link
    const link = event.target.closest(".description-link");
    if (!link) {
        console.error("Description link element not found!");
        return;
    }

    document.querySelectorAll(".description-link").forEach(el => el.classList.remove("active"));
    link.classList.add("active");
}

// Hide description card when clicking outside
document.addEventListener("click", function (e) {
    if (!e.target.closest(".description-card") && !e.target.classList.contains("description-link")) {
        document.querySelectorAll(".description-card").forEach(el => el.style.display = "none");
    }
});







// View file
function viewFile(filePath) {
    window.open(`/${filePath}`, "_blank");
}

// Download file
function downloadFile(filePath, filename) {
    const link = document.createElement("a");
    link.href = `/${filePath}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Edit the file
let currentFileId = null;

// Function to open edit modal and populate fields
function openEditModal(fileId, description) {
    currentFileId = fileId;
    document.getElementById("editFileId").value = fileId;
    document.getElementById("editFileDescription").value = description;

    const modal = new bootstrap.Modal(document.getElementById("editFileModal"));
    modal.show();
}

// Handle the file update request
document.getElementById("saveEditFileBtn").addEventListener("click", async function () {
    if (!currentFileId) return;

    const formData = new FormData();
    const description = document.getElementById("editFileDescription").value;
    const fileInput = document.getElementById("editFileInput").files[0];

    formData.append("description", description);
    if (fileInput) {
        formData.append("file", fileInput);
    }

    showLoading();

    try {
        const response = await fetch(`http://localhost:3270/api/documents/update/${currentFileId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: formData,
        });

        if (response.ok) {
            setTimeout(function () {
                hideLoading();
                showNotificationTopRight("File updated successfully.", "success");
                fetchFiles();
            }, 2000);
        } else {
            setTimeout(function () {
                hideLoading();
                showNotificationTopRight("Failed to update file.", "error");
            }, 2000);
        }
    } catch (error) {
        console.error("Error updating file:", error);
    }

    currentFileId = null;
    const modal = bootstrap.Modal.getInstance(document.getElementById("editFileModal"));
    modal.hide();
});



// Delete file
let fileToDelete = null;

async function deleteFile(fileId) {
    fileToDelete = fileId;
    const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    modal.show();
}

// When the user clicks "Delete" in the modal
document.getElementById("confirmDeleteBtn").addEventListener("click", async function () {
    if (!fileToDelete) return;

    showLoading();
    try {
        const response = await fetch(`http://localhost:3270/api/documents/files/${fileToDelete}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
            credentials: "include"
        });

        if (response.ok) {
            setTimeout(function () {
                hideLoading();
                showNotificationTopRight("File deleted successfully.", "success");
                fetchFiles();
            }, 2000);
        } else {
            setTimeout(function () {
                hideLoading();
                showNotificationTopRight("Failed to delete file.", "error");
            }, 2000);
        }
    } catch (error) {
        console.error("Error deleting file:", error);
    }

    fileToDelete = null; // Reset file ID
    const modal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
    modal.hide();
});


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
            // const labPatientId = userData.labPatientId;
            console.log("User: " + userData);
            console.log("User: " + userData.emergencyContact?.name);


            // Dynamically update the avatar based on user type
            if (userData.role === 'Patient') {
                document.getElementById('nav-current-image').src = imageUrl || 'img/ImageUnavailable.jpeg';
            }

        } else {
            console.error('Failed to fetch user profile:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

fetchUserProfile();