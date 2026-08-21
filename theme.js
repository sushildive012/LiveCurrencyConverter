// SEPERATE JS FILE ONLY FOR THEME TOGGLE(BEST PRACTICE)
const toggleThemeBtn = document.querySelector("#theme-toggle-btn");


//TOGGLE THEME DARK /LIGHT
// RUN IMMEDIATELY ON LOAD: Check and applies saved theme
function initializeTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    // Check device system preference second (returns true if system is dark mode)
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine target theme: use saved theme, or fallback to system preference, default to light
    let targetTheme = 'light';
    if (savedTheme) {
        targetTheme = savedTheme;
    } else if (systemPrefersDark) {
        targetTheme = 'dark';
    }

    // ALSO TOGGLE THEME BUTTON SUN/ MOON(when LOADED)
    // Replace &#x with \u{ and close with }
    toggleThemeBtn.textContent = targetTheme === "dark" ? "\u{2600}\u{FE0E} " : "\u{263E}\u{FE0E} ";



    
    // Apply theme to the HTML tag
    document.documentElement.setAttribute('data-theme', targetTheme);
}

// Call the function instantly when the file loads
initializeTheme();

// TOGGLE FUNCTION: Connected to your dark mode button click event
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Flip the value
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Update the HTML element
    document.documentElement.setAttribute('data-theme', newTheme);

    // ALSO TOGGLE THEME BUTTON SUN/ MOON(when Clicked)
    // Replace &#x with \u{ and close with }
    toggleThemeBtn.textContent = newTheme === "dark" ? "\u{2600}\u{FE0E} " : "\u{263E}\u{FE0E} ";



    // Save to localStorage so it persists on reload
    localStorage.setItem('theme', newTheme);
}

