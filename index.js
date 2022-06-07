//jshint esversion: 7

// comment out the line below to make axios work in-browser
// const { default: axios } = require("axios");

// require dotenv to isolate API key in the .env file
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

// Select the input box
const input = document.querySelector('input');

// Callback for event listener
const onInput = async (event) => {
    const movies = await fetchData(event.target.value);
    
    // Generate a list of HTML objects programmatically from the movies.Search list
    for (let movie of movies) {
        const div = document.createElement('div');

        div.innerHTML = `
            <img src="${movie.Poster}" />
            <h1>${movie.Title} (${movie.Year})</h1>
        `;

        document.querySelector('#target').appendChild(div);
    }
};

// Attach an event listener to the input box
input.addEventListener('input', debounce(onInput, 500));