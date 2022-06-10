//jshint esversion: 7

// comment out the line below to enable axios script for in-browser use
// const { default: axios } = require("axios");

// require dotenv to isolate API key in the .env file (also comment out for in-browser use)
// require('dotenv').config();

const key = ''; // please add in your own API key
// const key = process.env.API_KEY; // or use a .env file instead

// Fetch some data using an async function
// Accepts a user text input and performs a search of OMDb
const fetchData = async (searchTerm) => {

    // response stores the axios.get request
    // Two arguments are taken: a URI and a {params: {}} object
    const response = await axios.get('http://www.omdbapi.com/', {

    // params are from the OMDb API documentation: an API key and a 's' search parameter
    // switch 's' for 'i' when you need to do a lookup instead of a search
        params: {
            apikey: key, 
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

createAutoComplete({
    root: document.querySelector('.autocomplete'),
    renderOption(movie) {

        // Check if the poster img has a link, and clear link if val = 'N/A'
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

        return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
          `;
    }
});

// Helper function for onInput.
// onMovieSelect does a follow up search to fetch the selected movie 
// using the movie.imdbID attribute
const onMovieSelect = async (movie) => {
    const response = await axios.get('http://www.omdbapi.com/', {

        // params are from the OMDb API documentation: an API key and a 's' search parameter
        // switch 's' for 'i' when you need to do a lookup instead of a search
            params: {
                apikey: key,
                i: movie.imdbID
            }
        });

    // Insert movieTemplate's HTML into the #summary tag
    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

// Takes movie data from onMovieSelect and generates HTML from the data
// Once a user clicks a movie to select it, movieTemplate renders the selection
const movieTemplate = (movieDetail) => {
    return `
    <div class="container is-fluid">
        <article class="media">
        
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="content">
                <div>
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        
        </article>

        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
        </article>

        <article class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
        </article>

        <article class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDb Rating</p>
        </article>

        <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDb Votes</p>
        </article>
    </div>
    `;
};