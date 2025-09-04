# Tampermonkey Scripts

Collection of Tampermonkey userscripts for enhancing movie streaming sites.

## Scripts

### Vegamovies IMDB Rating
**File:** `vegamovies_script.js`

**Description:** Automatically fetches and displays IMDB ratings for movies on Vegamovies and Rogmovies sites.

**Features:**
- Extracts movie titles from grid layouts
- Cleans movie names by removing quality indicators, file sizes, and streaming platform info
- Fetches IMDB ratings from movie detail pages
- Displays ratings below movie titles with star emoji
- Works on multiple movie sites

**Supported Sites:**
- vegamovies.gmbh
- rogmovies.space

**Installation:**
1. Install Tampermonkey browser extension
2. Copy the script content
3. Create new userscript in Tampermonkey
4. Paste and save
5. Visit supported sites to see ratings

**How it works:**
1. Detects movie title links on page load
2. Opens each movie's detail page
3. Searches for "IMDb Rating:-" text pattern
4. Extracts the rating value
5. Updates the original page with clean title + rating
