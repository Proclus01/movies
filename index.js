//jshint esversion: 9

// comment out the line below to enable axios script for in-browser use
// const { default: axios } = require("axios");

// require dotenv to isolate API key in the .env file (also comment out for in-browser use)
// require('dotenv').config();

const key = ''; // please add in your own API key
// const key = process.env.API_KEY; // or use a .env file instead

const autoCompleteConfig = {
    renderOption(movie) {

        // Check if the poster img has a link, and clear link if val = 'N/A'
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

        return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
          `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        // Fetch some data using an async function
        // Accepts a user text input and performs a search of OMDb

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
    }
};

// call this function to create the autocomplete widget
// createAutoComplete accepts a config object with the following properties:
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        // Hide the tutorial div
        document.querySelector('.tutorial').classList.add('is-hidden');
        // Render the movie info
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }, 
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        // Hide the tutorial div
        document.querySelector('.tutorial').classList.add('is-hidden');
        // Render the movie info
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }, 
});

// Storage variables for movie information to be used in onMovieSelect
let leftMovie;
let rightMovie;

// Helper function for onInput.
// onMovieSelect does a follow up search to fetch the selected movie 
// using the movie.imdbID attribute
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {

        // params are from the OMDb API documentation: an API key and an 's' search parameter
        // switch 's' for 'i' when you need to do a lookup instead of a search
            params: {
                apikey: key,
                i: movie.imdbID
            }
        });

    // Insert movieTemplate's HTML into summaryElement target
    summaryElement.innerHTML = movieTemplate(response.data);

    // If there is data in any one autocomplete,
    // then store that data inside of our storage variables
    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data
    }

    // if both autocompletes are populated, then compare them
    if (leftMovie && rightMovie) {
        runComparison();
    }
};

// runComparison will compare our custom data-value properties
// and then will apply stylings to visualize value comparisons
// runComparison iterates over our HTML articles rendered by movieTemplate
const runComparison = () => {
    
    // Extract the HTML information into a arrays
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    // iterate using left-summary first
    leftSideStats.forEach((leftStat, index) => {
        // iterate over right-summary alongside our left-summary
        const rightStat = rightSideStats[index];

        // capture the numerical values of the statistics and convert STR to INT
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        // Take the lesser value of the compared elements and paint the element yellow
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');            
        }

    });

};

// Takes movie data from onMovieSelect and generates HTML from the data
// Once a user clicks a movie to select it, movieTemplate renders the selection
const movieTemplate = (movieDetail) => {

    // Extract data from object and store in variables

    // strip any $, decimals, and commmas, change data from STR to INT
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

    // Sum up all the numerical values inside of the Awards property
    // First convert from str to arr, then parseInt, then sum the numerical entries
    const awards = movieDetail.Awards.split(' ').reduce(
        (prev, word) => {

            const value = parseInt(word);

            if (isNaN(value)) {
                return prev;
            } else {
                return prev + value;
            }

        }, 0
        );

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

        <article data-value="${awards}" class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value="${dollars}" class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
        </article>

        <article data-value="${metascore}" class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
        </article>

        <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDb Rating</p>
        </article>

        <article data-value="${imdbVotes}" class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDb Votes</p>
        </article>
    </div>
    `;
};