// ==UserScript==
// @name         Vegamovies IMDB Rating
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get IMDB ratings for movies on Vegamovies
// @author       You
// @match        https://vegamovies.gmbh/*
// @match        https://www.vegamovies.gmbh/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('Vegamovies IMDB Rating script loaded');

    function cleanMovieName(name) {
        return name
            .replace(/^download\s+/i, '')  // Remove 'Download' prefix
            .replace(/\s*\(.*$/g, '')  // Remove everything after first (
            .replace(/\s*\|.*$/g, '')  // Remove everything after |
            .replace(/\s*\[.*?\]/g, '')  // Remove [file sizes]
            .replace(/\s*\{.*?\}/g, '')  // Remove {audio info}
            .replace(/\b(dual-audio|hindi-dubbed|multi\s*audio|netflix|prime|hotstar|amzn|web-dl|bluray|webrip|telesync|480p|720p|1080p|2160p|4k|sdr|org|line|dd5\.1|english|hindi|japanese|aac|complete|added|season|series|anime|full|movie|show|wwe|video|original|jiohotstar)\b/gi, '')
            .replace(/\s*(\d+\s*–\s*\d+|\d+)\s*/g, ' ')  // Remove season/episode numbers
            .replace(/\s*S\d+E\d+\s*/gi, ' ')  // Remove S01E01 format
            .replace(/\s*–\s*$/g, '')  // Remove trailing dash
            .replace(/\s*&\s*$/g, '')  // Remove trailing &
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .trim();
    }

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
        console.log(`Found ${articles.length} movies to process`);
        
        for (const link of articles) {
            if (link.dataset.ratingAdded) continue;
            
            const rawName = link.textContent.trim();
            const movieName = cleanMovieName(rawName);
            console.log(`Fetching rating for: ${movieName}`);
            const rating = await getIMDBRating(movieName);
            
            link.textContent = `${movieName} (${rating}⭐)`;
            link.dataset.ratingAdded = 'true';
        }
        console.log('Rating update complete');
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