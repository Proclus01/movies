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

    // test that we have the data
    console.log(response.data);
};

// Select the input box
const input = document.querySelector('input');

// Debounce outputs a function that serves as a wrapper for onInput  
// in order to restrict the calls we can make to onInput
// Debounce take as input a function
const debounce = (func) => {
    let timeoutId;

    // return a wrapper function to restrict calls to onInput
    return (...args) => {
        // clear the current timeoutId and stop the existing timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Limit how often the input function gets invoked
        // It will be called 1s after last input
        timeoutId = setTimeout(() => {
            // .apply passes in an array of arguments as separate arguments in function
            func.apply(null, args);
        }, 1000);
        
    };
};

// Callback for event listener
const onInput = (event) => {
        fetchData(event.target.value);
};

// Attach an event listener to the input box
input.addEventListener('input', debounce(onInput));