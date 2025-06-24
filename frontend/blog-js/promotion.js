// // Font configuration 
// const Font = Quill.import('formats/font');
// Font.whitelist = ['sans-serif', 'serif', 'monospace', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', 'Arial']; // Add your custom fonts here
// Quill.register(Font, true);

// // Font size configuration
// const Size = Quill.import('formats/size');
// Size.whitelist = ['small', 'normal', 'large', 'huge']; // Add your custom sizes here
// Quill.register(Size, true);

// // Text alignment configuration
// const Align = Quill.import('formats/align');
// Align.whitelist = ['left', 'center', 'right', 'justify'];
// Quill.register(Align, true);

// // Initialize Quill
// document.addEventListener("DOMContentLoaded", () => {
//   const quill = new Quill('#postContent', {
//     theme: 'snow',
//     modules: {
//       toolbar: [
//         [{ 'header': [1, 2, false] }], // Header sizes
//         [{ 'size': ['small', 'normal', 'large', 'huge'] }], // Font size dropdown
//         ['bold', 'italic', 'underline'], // Formatting options
//         [{ 'list': 'ordered' }, { 'list': 'bullet' }], // List options
//         [{ 'color': [] }, { 'background': [] }], // Color options
//         [{ 'font': [] }], // Font options
//         [{ 'align': [] }], // Text alignment options
//         ['link', 'image', 'video'], // Link and image options
//         ['clean'], // Clear formatting button
//         ['code-block'] // Code block option
//       ]
//     }
//   });
//   // Attach event listener to open the form

// });

// document.getElementById('createPromotion').addEventListener('click', () => {
//   document.getElementById('promotionFormPanel').style.display = 'block';
// });

// // Function to close the form
// function closePromotionForm() {
//   document.getElementById('promotionFormPanel').style.display = 'none';
// }

// // Add event listener for text changes
// quill.on('text-change', function (delta, oldDelta, source) {
//   if (source === 'user') {
//     // Select all images inside the Quill editor that do not have the 'content-image' class
//     const images = document.querySelectorAll('.ql-editor img');
//     images.forEach((img) => {
//       if (!img.classList.contains('content-image')) {
//         img.classList.add('content-image'); // Add custom class to control styles
//       }
//     });
//   }
// });


// quill.root.addEventListener('click', (event) => {
//   if (event.target.tagName === 'IMG') {
//     quill.format('align', null); // Ensure the format allows alignment changes
//     event.target.classList.add('content-image'); // Ensure custom styles apply
//   }
// });

// // Image alignment function
// function alignImage(alignDirection) {
//   const img = document.querySelector('.ql-editor img.selected'); // Assuming you have a way to mark the selected image
//   if (img) {
//     img.classList.remove('float-left', 'float-right', 'float-center'); // Remove any existing alignment classes
//     if (alignDirection === 'left') {
//       img.classList.add('float-left');
//     } else if (alignDirection === 'right') {
//       img.classList.add('float-right');
//     } else if (alignDirection === 'center') {
//       img.classList.remove('content-image', 'float-left', 'float-right',);
//       img.classList.add('float-center');
//     }
//   }
// }


// // Example alignment buttons
// document.querySelector('#alignLeftPromoButton').addEventListener('click', () => {
//   alignImage('left');
// });

// document.querySelector('#alignCenterPromoButton').addEventListener('click', () => {

//   alignImage('center');
// });

// document.querySelector('#alignRightPromoButton').addEventListener('click', () => {
//   alignImage('right');
// });

// // Logic to select the clicked image
// document.querySelector('.ql-editor').addEventListener('click', (e) => {
//   if (e.target.tagName === 'IMG') {
//     document.querySelectorAll('.ql-editor img').forEach(img => img.classList.remove('selected'));
//     e.target.classList.add('selected');
//   }
// });


// async function submitPromotion() {
//   const title = document.getElementById('promotionTitle').value;
//   const senderName = document.getElementById('promotionSenderName').value;
//   const content = quill.root.innerHTML; // Get Quill content as HTML

//   if (!title || !content || !senderName) {
//       alert("Please fill out all fields.");
//       return;
//   }

//   try {
//       const response = await fetch('http://localhost:3173/api/promotions', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//               title,
//               content,
//               senderName
//           })
//       });

//       const result = await response.json();
//       if (response.ok) {
//           alert(result.message);
//           closePromotionForm();
//       } else {
//           alert(`Error: ${result.error}`);
//       }
//   } catch (error) {
//       console.error('Error submitting promotion:', error);
//       alert('Failed to submit promotion. Please try again.');
//   }
// }



// let currentPromotionPage = 1;
//     let totalPages = 1;

//     async function fetchPromotions() {
//         const titleFilter = document.getElementById('filterTitle').value;
//         const senderFilter = document.getElementById('filterSender').value;
//         const sortBy = document.getElementById('sortBy').value;

//         const queryParams = new URLSearchParams({
//             title: titleFilter,
//             sender: senderFilter,
//             sort: sortBy,
//             page: currentPromotionPage,
//             limit: 10,
//         }).toString();

//         try {
//             const response = await fetch(`http://localhost:3173/api/promotions?${queryParams}`);
//             const result = await response.json();

//             if (response.ok) {
//                 // Update counts and pagination
//                 document.getElementById('totalPromotions').textContent = result.totalCount;
//                 document.getElementById('currentPage').textContent = result.page;
//                 document.getElementById('totalPages').textContent = result.totalPages;

//                 // Enable/Disable pagination buttons
//                 document.getElementById('prevPage').disabled = result.page === 1;
//                 document.getElementById('nextPage').disabled = result.page === result.totalPages;

//                 // Populate table
//                 const tableBody = document.querySelector("#promotionTable tbody");
//                 tableBody.innerHTML = ''; // Clear existing rows

//                 result.data.forEach(promotion => {
//                     const row = document.createElement('tr');
//                     row.innerHTML = `
//                         <td>${promotion.title}</td>
//                         <td>${new Date(promotion.createdAt).toLocaleString()}</td>
//                         <td>${promotion.senderName}</td>
//                         <td>
//                             <button onclick="resendPromotion('${promotion._id}')">Resend</button>
//                             <button onclick="deletePromotion('${promotion._id}')">Delete</button>
//                         </td>
//                     `;
//                     tableBody.appendChild(row);
//                 });
//             } else {
//                 alert('Failed to fetch promotions.');
//             }
//         } catch (error) {
//             console.error('Error fetching promotions:', error);
//         }
//     }

//     document.getElementById('refreshPromotions').addEventListener('click', () => {
//         currentPromotionPage = 1;
//         fetchPromotions();
//     });

//     document.getElementById('prevPage').addEventListener('click', () => {
//         if (currentPromotionPage > 1) {
//             currentPromotionPage--;
//             fetchPromotions();
//         }
//     });

//     document.getElementById('nextPage').addEventListener('click', () => {
//         if (currentPromotionPage < totalPages) {
//             currentPromotionPage++;
//             fetchPromotions();
//         }
//     });


// async function resendPromotion(id) {
//   try {
//       const response = await fetch(`http://localhost:3173/api/promotions/resend/${id}`, {
//           method: 'POST'
//       });
//       const result = await response.json();

//       if (response.ok) {
//           alert('Promotion resent successfully.');
//       } else {
//           alert(`Failed to resend promotion: ${result.message}`);
//       }
//   } catch (error) {
//       console.error('Error resending promotion:', error);
//   }
// }

// async function deletePromotion(id) {
//   if (!confirm('Are you sure you want to delete this promotion?')) return;

//   try {
//       const response = await fetch(`http://localhost:3173/api/promotions/${id}`, {
//           method: 'DELETE'
//       });
//       const result = await response.json();

//       if (response.ok) {
//           alert('Promotion deleted successfully.');
//           fetchPromotions(); // Refresh the list
//       } else {
//           alert(`Failed to delete promotion: ${result.message}`);
//       }
//   } catch (error) {
//       console.error('Error deleting promotion:', error);
//   }
// }

// // Fetch promotions on page load
// document.addEventListener('DOMContentLoaded', () => {
//   fetchPromotions();
//   document.getElementById('refreshPromotions').addEventListener('click', fetchPromotions);
// });