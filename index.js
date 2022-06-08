//jshint esversion: 7

// comment out the line below to enable axios script for in-browser use
// const { default: axios } = require("axios");

// require dotenv to isolate API key in the .env file (also comment out for in-browser use)
// require('dotenv').config();

// Fetch some data using an async function
// Accepts a user text input and performs a search of OMDb
const fetchData = async (searchTerm) => {

    // response stores the axios.get request
    // Two arguments are taken: a URI and a {params: {}} object
    const response = await axios.get('http://www.omdbapi.com/', {

    // params are from the OMDb API documentation: an API key and a 's' search parameter
    // switch 's' for 'i' when you need to do a lookup instead of a search
        params: {
            // uncomment the line below to use your .env for an API key if you have one
            // apikey: process.env.API_KEY,

            apikey: '', // or please add in your own API key
            s: searchTerm
        }
    });

    // if there's an error due to no file being returned
    // then make sure that at least an empty array is returned
    // since our onInput expects a parameter
    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
};

// Select the autocomplete HTML tag in index.html
const root = document.querySelector('.autocomplete');

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
const input = document.querySelector('input');

// Selectors for Bulma CSS objects
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

// Callback for event listener
const onInput = async (event) => {
    const movies = await fetchData(event.target.value);

    // If there are no results, return nothing
    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }

    // reset the search results first
    resultsWrapper.innerHTML = '';
    
    // Turn on the isActive flag inside of our menu item (Bulma CSS)
    dropdown.classList.add('is-active');

    // Generate a list of HTML objects programmatically from the movies.Search list
    for (let movie of movies) {
        const option = document.createElement('a');

        // Check if the poster img has a link, and clear link if val = 'N/A'
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        // Style the menu using Bulma CSS
        option.classList.add('dropdown-item');

        // Append HTML to the anchor tag
        option.innerHTML = `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;

        // Append our looped elements to the results-wrapper (Bulma)
        resultsWrapper.appendChild(option);
    }
};

// Attach an event listener to the input box
input.addEventListener('input', debounce(onInput, 500));

// Attach an event listener to test for click events in browser
// UI feature: if you click anywhere outside of the menu, the menu will close
document.addEventListener('click', event => {
    // If the selected element is not in 'root', then close the menu
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});