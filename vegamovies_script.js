// ==UserScript==
// @name         Vegamovies IMDB Rating
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get IMDB ratings for movies on Vegamovies
// @author       You
// @match        https://vegamovies.gmbh/*
// @match        https://www.vegamovies.gmbh/*
// @match        https://rogmovies.space/*
// @match        https://www.rogmovies.space/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    


    function cleanMovieName(name) {
        return name
            .replace(/^download\s+/i, '')
            .replace(/\s*\(.*$/g, '')
            .replace(/\s*\|.*$/g, '')
            .replace(/\s*\[.*?\]/g, '')
            .replace(/\s*\{.*?\}/g, '')
            .replace(/\b(dual-audio|hindi-dubbed|multi\s*audio|netflix|prime|hotstar|amzn|web-dl|bluray|webrip|telesync|480p|720p|1080p|2160p|4k|sdr|org|line|dd5\.1|english|hindi|japanese|aac|complete|added|season|series|anime|full|movie|show|wwe|video|original|jiohotstar)\b/gi, '')
            .replace(/\s*(\d+\s*–\s*\d+|\d+)\s*/g, ' ')
            .replace(/\s*S\d+E\d+\s*/gi, ' ')
            .replace(/\s*–\s*$/g, '')
            .replace(/\s*&\s*$/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async function getIMDBRating(movieUrl) {
        try {
            const response = await fetch(movieUrl);
            const html = await response.text();
            
            const match = html.match(/IMDb Rating:-\s*([\d\.]+)/i);
            return match ? match[1] : 'N/A';
        } catch {
            return 'N/A';
        }
    }

    async function addRatings() {
        const selectors = ['#grid-wrapper article .post-title a', '.post-title a', 'h2 a', 'h3 a'];
        const links = selectors.flatMap(sel => [...document.querySelectorAll(sel)]);
        
        for (const link of links) {
            if (link.dataset.ratingAdded) continue;
            
            const rawName = link.textContent.trim();
            const movieName = cleanMovieName(rawName);
            const rating = await getIMDBRating(link.href);
            
            link.innerHTML = `${movieName}<br>(${rating} ⭐)`;
            link.dataset.ratingAdded = 'true';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addRatings);
    } else {
        addRatings();
    }

    new MutationObserver(() => addRatings()).observe(document.body, { childList: true, subtree: true });
})();