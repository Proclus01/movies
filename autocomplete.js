// input takes config object, starting with root element
// root element is a reference to the HTML root object in index.html
const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue }) => {
  // Append to 'root' our dropdown menu HTML code
  root.innerHTML = `
    <label><b>Search for a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

  // Select the input box
  const input = root.querySelector("input");

  // Selectors for Bulma CSS objects
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  // Callback for event listener
  // onInput contains a large part of the main logic of this app
  // It appends a series of HTML objects to the 'root' dropdown menu, styled with Bulma CSS
  const onInput = async (event) => {
    // Get the movie list from OMDb API
    const movies = await fetchData(event.target.value);

    // If there are no results, return nothing
    if (!movies.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    // reset the search results first
    resultsWrapper.innerHTML = "";

    // Turn on the isActive flag inside of our menu item (Bulma CSS)
    dropdown.classList.add("is-active");

    // Generate a list of HTML objects programmatically from the movies.Search list
    for (let movie of movies) {
      const option = document.createElement("a");

      // Style the menu using Bulma CSS
      option.classList.add("dropdown-item");

      // Append HTML to the anchor tag
      option.innerHTML = renderOption(movie);

      // Add an event listener to the anchor tag for menu functionality
      option.addEventListener("click", () => {
        // Make menu disappear on click of anchor
        dropdown.classList.remove("is-active");

        // Update the text inside the input
        input.value = inputValue(movie);

        // Selecting an option from  the menu
        onOptionSelect(movie);
      });

      // Append our looped elements to the results-wrapper (Bulma)
      resultsWrapper.appendChild(option);
    }
  };

  // Attach an event listener to the input box
  input.addEventListener("input", debounce(onInput, 500));

  // Attach an event listener to test for click events in browser
  // UI feature: if you click anywhere outside of the menu, the menu will close
  document.addEventListener("click", (event) => {
    // If the selected element is not in 'root', then close the menu
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
