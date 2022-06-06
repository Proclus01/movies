// Debounce outputs a function that serves as a wrapper for onInput  
// in order to restrict the calls we can make to onInput
// Debounce take as input a function, and delay in ms with default at 1000
const debounce = (func, delay = 1000) => {
    let timeoutId;

    // return a wrapper function to restrict calls to onInput
    return (...args) => {
        // clear the current timeoutId and stop the existing timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Limit how often the input function gets invoked
        // It will be called by 'delay' amount after last input
        timeoutId = setTimeout(() => {
            // .apply passes in an array of arguments as separate arguments in function
            func.apply(null, args);
        }, delay);
        
    };
};