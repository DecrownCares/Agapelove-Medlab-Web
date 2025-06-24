// const quill = new Quill('#editor', {
//   theme: 'snow',
//   modules: {
//       toolbar: [
//           [{ 'header': [1, 2, false] }],
//           ['bold', 'italic', 'underline'],
//           ['blockquote', 'code-block'],
//           [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//           ['link', 'image'],
//           ['clean'] // remove formatting button
//       ]
//   }
// });

// // Create Post Form Submission
// document.getElementById("postForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   // Collect form data
//   const author = document.getElementById("postAuthor").value;
//   const title = document.getElementById("postTitle").value;
//   const content = document.getElementById("postContent").value;
//   const videoUrl = document.getElementById("postVideoUrl").value;
//   const category = document.getElementById("postCategory").value;
//   const tags = document.getElementById("postTags").value.split(",").map(tag => tag.trim());
//   const imageInput = document.getElementById("postImage").files[0];

//   // Prepare FormData for image upload
//   const formData = new FormData();
//   formData.append("author", author);
//   formData.append("title", title);
//   formData.append("content", content);
//   formData.append("videoUrl", videoUrl);
//   formData.append("categories", category);
//   formData.append("tags", JSON.stringify(tags));
//   if (imageInput) {
//     formData.append("image", imageInput); // Ensure the input field is named 'image'
//   }

//   try {
//     const response = await fetch("http://localhost:5000/api/posts/post", {
//       method: "POST",
//       headers: { 
        
//         // "Authorization": `Bearer ${accessToken}`,
//       },
//       body: formData, // Used formData instead of JSON
//     });

//     const data = await response.json();
//     document.getElementById("error-message").innerText = "Post created successfully!";
//     // Clear form fields
//     document.getElementById("postAuthor").value = "";
//     document.getElementById("postTitle").value = "";
//     document.getElementById("postContent").value = "";
//     document.getElementById("postVideoUrl").value = "";
//     document.getElementById("postCategory").value = "";
//     document.getElementById("postTags").value = "";
//     document.getElementById("postImage").value = "";
//   } catch (error) {
//     console.error("Error creating post:", error);
//   }
// });




// Font configuration 
const Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', 'Arial']; // Add your custom fonts here
Quill.register(Font, true);

// Font size configuration
const Size = Quill.import('formats/size');
Size.whitelist = ['small', 'normal', 'large', 'huge']; // Add your custom sizes here
Quill.register(Size, true);

// Text alignment configuration
const Align = Quill.import('formats/align');
Align.whitelist = ['left', 'center', 'right', 'justify'];
Quill.register(Align, true);

// Initialize Quill
const quill = new Quill('#postContent', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Header sizes
            [{ 'size': ['small', 'normal', 'large', 'huge'] }], // Font size dropdown
            ['bold', 'italic', 'underline'], // Formatting options
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // List options
            [{ 'color': [] }, { 'background': [] }], // Color options
            [{ 'font': [] }], // Font options
            [{ 'align': [] }], // Text alignment options
            ['link', 'image', 'video'], // Link and image options
            ['clean'], // Clear formatting button
            ['blockquote', 'code-block'], // Blockquote and code block
            [{ 'indent': '-1' }, { 'indent': '+1' }], // Indentation options
            ['hr'] // Horizontal rule (custom handler)
        ]
    }
});

// const toolbarOptions = quill.getModule('toolbar');
// toolbarOptions.addHandler('hr', function() {
//     const range = quill.getSelection();
//     if (range) {
//         quill.insertEmbed(range.index, 'hr', true);
//         quill.setSelection(range.index + 1, Quill.sources.SILENT);
//     }
// });

// Quill.register('formats/hr', class HR extends Quill.import('blots/block/embed') {
//     static create() {
//         const node = super.create();
//         node.setAttribute('contenteditable', 'false');
//         return node;
//     }
//     static value() {
//         return true;
//     }
// });
// HR.blotName = 'hr';
// HR.tagName = 'hr';

// Create a custom module for table support

// const Table = Quill.import('table');
// Quill.register(Table, true);

// const TableModule = Quill.import('modules/table');
// const tableModule = new TableModule();

// // Initialize Quill with the table module

// quill.modules.add(tableModule);

// // Function to add a table to the Quill editor

// function addTable() {
//     const delta = quill.clipboard.convert(tableModule.createTable(3, 3)); // Example: create a 3x3 table
//     quill.insertDelta(quill.getLength(), delta);
// }

// // Function to remove a table from the Quill editor

// function removeTable() {
//     const delta = quill.clipboard.convert(tableModule.deleteTable());
//     quill.insertDelta(quill.getLength(), delta);
// }

// Add event listener for text changes
quill.on('text-change', function(delta, oldDelta, source) {
    if (source === 'user') {
        // Select all images inside the Quill editor that do not have the 'content-image' class
        const images = document.querySelectorAll('.ql-editor img');
        images.forEach((img) => {
            if (!img.classList.contains('content-image')) {
                img.classList.add('content-image'); // Add custom class to control styles
            }
        });
    }
});


quill.root.addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG') {
        quill.format('align', null); // Ensure the format allows alignment changes
        event.target.classList.add('content-image'); // Ensure custom styles apply
    }
});

// Image alignment function
function alignImage(alignDirection) {
    const img = document.querySelector('.ql-editor img.selected'); // Assuming you have a way to mark the selected image
    if (img) {
        img.classList.remove('float-left', 'float-right', 'float-center'); // Remove any existing alignment classes
        if (alignDirection === 'left') {
            img.classList.add('float-left');
        } else if (alignDirection === 'right') {
            img.classList.add('float-right');
        } else if (alignDirection === 'center') {
            img.classList.remove('content-image', 'float-left', 'float-right',);
            img.classList.add('float-center'); 
        }
    }
}


// Example alignment buttons
document.querySelector('#alignLeftButton').addEventListener('click', () => {
    alignImage('left');
});

document.querySelector('#alignCenterButton').addEventListener('click', () => {

    alignImage('center');
});

document.querySelector('#alignRightButton').addEventListener('click', () => {
    alignImage('right');
});

// Logic to select the clicked image
document.querySelector('.ql-editor').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        document.querySelectorAll('.ql-editor img').forEach(img => img.classList.remove('selected'));
        e.target.classList.add('selected');
    }
});



document.querySelectorAll('.main-category').forEach(category => {
    category.addEventListener('click', function () {
      const subcategories = this.querySelector('.subcategories');
      subcategories.style.display = subcategories.style.display === 'block' ? 'none' : 'block';
    });
  });
  
  document.querySelectorAll('.subcategories input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const selectedContainer = document.getElementById('selected-categories');
      if (this.checked) {
        const tag = document.createElement('div');
        tag.className = 'selected-tag';
        tag.innerText = this.nextElementSibling.innerText;
        tag.dataset.value = this.value;
        selectedContainer.appendChild(tag);
      } else {
        const tag = document.querySelector(`.selected-tag[data-value="${this.value}"]`);
        tag && selectedContainer.removeChild(tag);
      }
    });
  });
  



// Create Post Form Submission
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const selectedCategories = Array.from(document.querySelectorAll('#selected-categories .selected-tag'))
    .map(tag => tag.dataset.value);

  // Collect form data
  const title = document.getElementById("postTitle").value;
  const content = quill.root.innerHTML; // Get content from Quill
  const videoUrl = document.getElementById("postVideoUrl").value;
  const category = document.getElementById("postCategory").value;
  const isSponsored = document.getElementById('is-sponsored').checked;
  const subCategory = selectedCategories;
  const postType = document.getElementById("postType").value;
if (!postType) {
  console.error('Post type is empty or undefined');
}
  const tags = document.getElementById("postTags").value.split(",").map(tag => tag.trim());
  const imageInput = document.getElementById("postImage").files[0];

  if (!title || !content || !category || subCategory.length === 0 || !postType || tags.length === 0 ) {
    document.getElementById("error-message").innerText = 'Please fill in all required fields';
    return;
  }
  
  // Prepare FormData for image upload
  const formData = new FormData();
  formData.append("isSponsored", isSponsored);
  formData.append("title", title);
  formData.append("content", content);
  formData.append("videoUrl", videoUrl);
  formData.append("categories", category);
  formData.append("subCategories", JSON.stringify(subCategory));
  formData.append("types", postType);
  formData.append("tags", JSON.stringify(tags));

  if (imageInput) {
        formData.append("image", imageInput); // Ensure the input field is named 'image'
      }
    

  try {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch("https://infohub-ffez.onrender.com/api/post", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${accessToken}`, // Ensure the JWT is included here
        },
        credentials: 'include', 
        body: formData,
    });
    

    console.log('Response status:', response.status); // Log status for debugging
    if (!response.ok) {
        let errorMessage = 'Failed to create post';
        try {
            const errorResponse = await response.json();
            console.error('Response error:', errorResponse);
            errorMessage = errorResponse.message || errorMessage;
        } catch (e) {
            console.error('Error parsing JSON response:', e);
        }
        throw new Error(errorMessage);
    }

      const data = await response.json();
      document.getElementById("error-message").innerText = "Post created successfully!";
      
      // Clear form fields
      document.getElementById("is-sponsored").checked = false;
      document.getElementById("postTitle").value = "";
      quill.setContents([]); // Clear Quill editor
      document.getElementById("postVideoUrl").value = "";
      document.getElementById("postCategory").value = "";
      document.getElementById("postType").value = "";
      document.getElementById("postTags").value = "";
      document.getElementById("postImage").value = "";
      document.getElementById("postType").value = "";
      document.querySelectorAll('#selected-categories .selected-tag').value = "";
  } catch (error) {
      document.getElementById("error-message").innerText = "Error creating post: " + error.message;
  }
});




