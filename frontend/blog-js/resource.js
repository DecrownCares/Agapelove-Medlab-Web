document.addEventListener("DOMContentLoaded", () => {
  const resourceContainer = document.getElementById("resource-container");

  // Fetch and load resources
  fetch("Js/resources.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((resources) => {
      // Render all resources initially
      renderResources(resources);

      // Add filtering functionality
      const categoryButtons = document.querySelectorAll(".category-btn");

      categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.getAttribute("data-filter");

          // Filter resources based on category
          const filteredResources = filter === "all" 
            ? resources 
            : resources.filter((resource) => resource.category === filter);

          // Re-render resources based on the filter
          renderResources(filteredResources);
        });
      });
    })
    .catch((error) => {
      console.error("Error loading resources:", error);
      resourceContainer.innerHTML = "<p>Failed to load resources. Please try again later.</p>";
    });

  // Function to render resources
  function renderResources(resources) {
    resourceContainer.innerHTML = ""; // Clear the container
    if (resources.length === 0) {
      resourceContainer.innerHTML = "<p>No resources available in this category.</p>";
      return;
    }

    resources.forEach((resource) => {
      const card = `
        <div class="resource-card" data-category="${resource.category}">
          <img src="${resource.image}" alt="${resource.title}" class="resource-image" />
          <h3>${resource.title}</h3>
          <p>${resource.description}</p>
          <a href="${resource.link}" target="_blank" class="btn">${resource.buttonText}</a>
        </div>
      `;
      resourceContainer.innerHTML += card;
    });
  }
});
