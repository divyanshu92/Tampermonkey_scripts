// ==UserScript==
// @name         Vegamovies IMDB Rating
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get IMDB ratings for movies on Vegamovies
// @author       You
// @match        https://vegamovies.*/*
// @match        https://www.vegamovies.*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    async function getIMDBRating(movieName) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=trilogy`);
            const data = await response.json();
            return data.imdbRating !== 'N/A' ? data.imdbRating : 'N/A';
        } catch {
            return 'N/A';
        }
    }

    async function addRatings() {
        const articles = document.querySelectorAll('#grid-wrapper article .post-title a');
        
        for (const link of articles) {
            if (link.dataset.ratingAdded) continue;
            
            const movieName = link.textContent.trim();
            const rating = await getIMDBRating(movieName);
            
            link.textContent = `${movieName} (${rating}⭐)`;
            link.dataset.ratingAdded = 'true';
        }
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addRatings);
    } else {
        addRatings();
    }

    // Run on dynamic content changes
    new MutationObserver(() => addRatings()).observe(document.body, { childList: true, subtree: true });
})();