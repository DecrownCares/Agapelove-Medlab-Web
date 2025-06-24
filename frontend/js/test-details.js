fetch("tests.json")
  .then(response => response.json())
  .then(data => {
    const testId = new URLSearchParams(window.location.search).get("test"); // Get test ID from URL
    console.log("Test ID from URL:", testId); // Debugging line

    // Find the category that contains the testId
    const category = data.categories.find(cat => cat.tests.some(test => test.id === testId));

    if (category) {
      // Find the specific test within the category
      const test = category.tests.find(test => test.id === testId);

      if (test) {
        // Update page title
        document.title = `${test.name} | Test Details`;

        // Display the test details on the page
        document.getElementById("test-name").textContent = test.name;
        document.getElementById("test-subname").textContent = test.subName;
        document.getElementById("test-description").textContent = test.description;
        document.getElementById("test-full-details").textContent = test.fullDetails;
        document.getElementById("test-image").src = test.image;

        // Render the sections for the test
        const testSectionsContainer = document.getElementById("test-sections");
        testSectionsContainer.innerHTML = ""; // Clear previous content
        test.sections.forEach(section => {
          const sectionElement = document.createElement("div");
          sectionElement.classList.add("mb-4");

          const titleElement = document.createElement("h4");
          titleElement.textContent = section.title;
          sectionElement.appendChild(titleElement);

          if (Array.isArray(section.content)) {
            const listElement = document.createElement("ul");
            section.content.forEach(item => {
              const listItem = document.createElement("li");
              listItem.textContent = item;
              listElement.appendChild(listItem);
            });
            sectionElement.appendChild(listElement);
          } else {
            const paragraphElement = document.createElement("p");
            paragraphElement.textContent = section.content;
            sectionElement.appendChild(paragraphElement);
          }

          testSectionsContainer.appendChild(sectionElement);
        });

        // Display the contact info
        document.getElementById("contact-address").textContent = test.contact.address;
        document.getElementById("contact-phone").textContent = test.contact.phone;
        document.getElementById("contact-phone").href = `tel:${test.contact.phone}`;
        document.getElementById("contact-email").textContent = test.contact.email;
        document.getElementById("contact-email").href = `mailto:${test.contact.email}`;
        document.getElementById("cta-button").textContent = test.cta;

        // Display similar tests
        displaySimilarTests(category.tests, test.id);
      } else {
        console.error("Test not found in the category.");
      }
    } else {
      console.error("Category not found for the given testId.");
    }
  })
  .catch(error => console.error("Error loading test data:", error));

// Function to display similar tests
function displaySimilarTests(tests, currentTestId) {
  const similarTestsList = document.getElementById("similar-tests-list");
  similarTestsList.innerHTML = ""; // Clear previous similar tests

  // Filter out the current test from the list and display others as similar tests
  tests.filter(test => test.id !== currentTestId).forEach(similarTest => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");

    const link = document.createElement("a");
    link.href = `test-details.html?test=${similarTest.id}`;
    link.textContent = similarTest.name;

    listItem.appendChild(link);
    similarTestsList.appendChild(listItem);
  });
}



// Fetch test details from JSON and display on page
// document.addEventListener("DOMContentLoaded", function () {
//     fetch("tests.json")
//         .then(response => response.json())
//         .then(data => {
//             const test = data.categories[0].tests[0]; // Fetch the first test

//             // Update Basic Info
//             document.getElementById("test-name").textContent = test.name;
//             document.getElementById("test-subname").textContent = test.subName;
//             document.getElementById("test-description").textContent = test.description;
//             document.getElementById("test-full-details").textContent = test.fullDetails;
//             document.getElementById("test-image").src = test.image;

//             // Update Contact Info
//             document.getElementById("contact-address").textContent = test.contact.address;
//             document.getElementById("contact-phone").textContent = test.contact.phone;
//             document.getElementById("contact-phone").href = "tel:" + test.contact.phone;
//             document.getElementById("contact-email").textContent = test.contact.email;
//             document.getElementById("contact-email").href = "mailto:" + test.contact.email;

//             // Populate Sections with Lists
//             const sectionsContainer = document.getElementById("test-sections");
//             test.sections.forEach(section => {
//                 const sectionDiv = document.createElement("div");
//                 sectionDiv.classList.add("mt-4");

//                 const sectionTitle = document.createElement("h3");
//                 sectionTitle.classList.add("text-primary");
//                 sectionTitle.textContent = section.title;
//                 sectionDiv.appendChild(sectionTitle);

//                 // Check if content contains bullet points
//                 if (section.content.includes("1️⃣") || section.content.includes("🩸")) {
//                     const ul = document.createElement("ul");
//                     ul.classList.add("list-group");

//                     // Split by numbers or bullet points
//                     const items = section.content.split(/[0-9️⃣🩸🦠🫀🫁]+/).filter(item => item.trim() !== "");
//                     items.forEach(item => {
//                         const li = document.createElement("li");
//                         li.classList.add("list-group-item");
//                         li.textContent = item.trim();
//                         ul.appendChild(li);
//                     });

//                     sectionDiv.appendChild(ul);
//                 } else {
//                     const sectionText = document.createElement("p");
//                     sectionText.textContent = section.content;
//                     sectionDiv.appendChild(sectionText);
//                 }

//                 sectionsContainer.appendChild(sectionDiv);
//             });

//             // CTA Button
//             document.getElementById("cta-button").textContent = test.cta;
//         })
//         .catch(error => console.error("Error loading JSON:", error));
// });


