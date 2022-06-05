//jshint esversion: 7

// comment out the line below to make axios work in-browser
const { default: axios } = require("axios");

// require dotenv to isolate API key in the .env file
require('dotenv').config();

// Fetch some data using an async function
// Two arguments are taken: a URI and a {params: {}} object
const fetchData = async () => {

    // response stores the axios.get request
    const response = await axios.get('http://www.omdbapi.com/', {

    // params are from the OMDb API documentation: an API key and a 's' search parameter
        params: {
            apikey: process.env.API_KEY,
            i: 'tt0848228'
        }
    });

    // test that we have the data
    console.log(response.data);
};

// Run the function
fetchData();