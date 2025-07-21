document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const recipesContainer = document.getElementById("recipes");
  const modal = document.getElementById("recipe-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalInstructions = document.getElementById("modal-instructions");
  const closeModal = document.getElementById("close-modal");

  // Fetch recipes based on query
  async function fetchRecipes(query) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    return data.meals || [];
  }

  // Display recipe cards
  function renderRecipes(recipes) {
    recipesContainer.innerHTML = "";
    if (recipes.length === 0) {
      recipesContainer.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    recipes.forEach((meal) => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
      `;
      card.addEventListener("click", () => showModal(meal));
      recipesContainer.appendChild(card);
    });
  }

  // Show modal with recipe info
  function showModal(meal) {
    modalTitle.textContent = meal.strMeal;
    modalImage.src = meal.strMealThumb;
    modalImage.alt = meal.strMeal;
    modalInstructions.textContent = meal.strInstructions;
    modal.classList.remove("hidden");
  }

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal if clicked outside content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Search input event
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length > 1) {
      try {
        const recipes = await fetchRecipes(query);
        renderRecipes(recipes);
      } catch (error) {
        recipesContainer.innerHTML = "<p>Error fetching recipes. Please try again.</p>";
        console.error("Fetch error:", error);
      }
    } else {
      recipesContainer.innerHTML = "";
    }
  });

  // === Review form handling ===
  const reviewForm = document.getElementById("review-form");
  const reviewsList = document.getElementById("reviews-list");

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const recipeName = document.getElementById("recipe-name").value.trim();
    const reviewerName = document.getElementById("reviewer-name").value.trim();
    const reviewText = document.getElementById("review-text").value.trim();
    const rating = document.getElementById("rating").value;

    if (!recipeName || !reviewerName || !reviewText) {
      alert("Please fill in all review fields.");
      return;
    }

    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.innerHTML = `
      <h4>${recipeName} - ${rating} ⭐</h4>
      <p><strong>${reviewerName}:</strong> ${reviewText}</p>
    `;

    reviewsList.appendChild(reviewItem);

    reviewForm.reset();
  });
});
