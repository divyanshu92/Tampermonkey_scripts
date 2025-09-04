// ==UserScript==
// @name         Vegamovies Site Analyzer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Analyze vegamovies.gmbh site structure for movie titles
// @author       You
// @match        https://vegamovies.gmbh/*
// @match        https://www.vegamovies.gmbh/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('=== VEGAMOVIES SITE ANALYZER ===');
    
    function analyzeSelectors() {
        const selectors = [
            '#grid-wrapper article .post-title a',
            '.post-title a',
            'article .post-title a',
            '.entry-title a',
            'h2 a',
            'h3 a',
            '.movie-title',
            '.title a',
            'article h2 a',
            'article h3 a',
            '.post-content a',
            '.entry-content a'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`✓ Found ${elements.length} elements with selector: ${selector}`);
                elements.forEach((el, i) => {
                    if (i < 3) { // Show first 3 examples
                        console.log(`  - "${el.textContent.trim()}"`);
                    }
                });
            }
        });
    }
    
    function analyzeStructure() {
        console.log('\n=== ANALYZING PAGE STRUCTURE ===');
        
        // Check for common containers
        const containers = ['#grid-wrapper', '.grid-wrapper', '#main', '.main', '.content', '#content'];
        containers.forEach(container => {
            const el = document.querySelector(container);
            if (el) {
                console.log(`✓ Found container: ${container}`);
                console.log(`  - Children: ${el.children.length}`);
            }
        });
        
        // Find all links that might be movie titles
        const allLinks = document.querySelectorAll('a');
        const movieLinks = Array.from(allLinks).filter(link => {
            const text = link.textContent.trim();
            return text.length > 5 && !text.includes('Read More') && !text.includes('Download');
        });
        
        console.log(`\n✓ Found ${movieLinks.length} potential movie title links`);
        movieLinks.slice(0, 5).forEach(link => {
            console.log(`  - "${link.textContent.trim()}" (${link.tagName.toLowerCase()})`);
            console.log(`    Parent: ${link.parentElement.className || link.parentElement.tagName}`);
        });
    }
    
    // Run analysis immediately and on load
    console.log('Script started, analyzing...');
    
    function runAnalysis() {
        console.log('Running analysis now...');
        analyzeSelectors();
        analyzeStructure();
        console.log('\n=== ANALYSIS COMPLETE ===');
    }
    
    // Run immediately
    runAnalysis();
    
    // Also run after page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAnalysis);
    }
    
    // Run after a delay for dynamic content
    setTimeout(runAnalysis, 3000);
    
})();