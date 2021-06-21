import fetchData from './api';
import { generateCardHtml, updateCountryDetails } from './ui';

// ----------------- DOM QUERIES -----------------
const themeSwitcher = document.querySelector('.theme-switcher');
const darkmodeBtn = themeSwitcher.querySelector('.theme-icon');
const feedbackToggler = document.querySelector('.theme-feedback');
const mainSection = document.querySelector('.main-section');
const overlay = document.querySelector('.country-overlay');
const closeOverlay = document.querySelector('.close-overlay');
const countryFilter = document.querySelector('.country-filter');
const regionFilter = document.querySelector('.region-filter');
const countriesContainer = document.querySelector('.cards-section');
const bordersContainer = document.querySelector('.click-borders');
const scrollBtn = document.querySelector('.scroll-top');

// ----------------- FUNCTIONS -----------------
// APPLY DARK MODE
const applyDarkMode = () => {
    const elemCls = document.querySelectorAll('.element');
    const bgCls = document.querySelectorAll('.background');

    if(darkmodeBtn.classList.contains('on')) {
        elemCls.forEach(elem => elem.classList.add('dark'));
        bgCls.forEach(elem => elem.classList.add('dark'));
        feedbackToggler.textContent = 'ON';

        // Store theme setting in local storage
        localStorage.setItem('mode', 'dark');
    } else {
        elemCls.forEach(elem => elem.classList.remove('dark'));
        bgCls.forEach(elem => elem.classList.remove('dark'));
        feedbackToggler.textContent = 'OFF';
        
        // Store theme setting in local storage
        localStorage.setItem('mode', 'light');
    }
}

// ----------------- EVENT LISTENERS -----------------
// FILTER COUNTRIES BY NAME
let timer;
countryFilter.addEventListener('input', e => {
    e.preventDefault();
    const userInput = countryFilter.country.value.trim();
    if(timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        if(userInput.length === 0) {
            fetchData('https://restcountries.eu/rest/v2/all')
               .then(data => {
                   generateCardHtml(data);
                   applyDarkMode();
                });
        } else {
            fetchData(`https://restcountries.eu/rest/v2/name/${userInput}`)
               .then(data => {
                   generateCardHtml(data);
                   applyDarkMode();
                });
        }
    }, 400);
});

// FILTER COUNTRIES BY REGION
regionFilter.addEventListener('change', e => {
    e.preventDefault();
    const userInput = e.target.value;

    if(userInput === 'all') {
        fetchData('https://restcountries.eu/rest/v2/all')
           .then(data => {
               generateCardHtml(data);
               applyDarkMode();
           });
    } else {
        fetchData(`https://restcountries.eu/rest/v2/region/${userInput}`)
           .then(data => {
               generateCardHtml(data);
               applyDarkMode();
           });
    }
});

// SHOW COUNTRY DETAILS ON CLICK
countriesContainer.addEventListener('click', e => {
    const card = e.target.closest('.card');

    if(card !== null) {
        const countryName = card.querySelector('h5').textContent;
        fetchData(`https://restcountries.eu/rest/v2/name/${countryName}?fullText=true`)
           .then(data => {
               updateCountryDetails(data[0]);
               applyDarkMode();
               countryFilter.reset();
               // Hide main section & scroll button
               mainSection.classList.add('hide');
               scrollBtn.classList.add('hide');
               
               // Show overlay
               overlay.classList.add('display');
            });
    }
});

// DISPLAY BORDER COUNTRIES DETAILS ON CLICK
bordersContainer.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON') {
        const countryCode = e.target.textContent;
        fetchData(`https://restcountries.eu/rest/v2/alpha/${countryCode}`)
           .then(data => {
               updateCountryDetails(data);
               applyDarkMode();
           });
    }
});

// CLOSE OVERLAY ON CLICK
closeOverlay.addEventListener('click', e => {
    // Show main section & scroll button
    mainSection.classList.remove('hide');
    scrollBtn.classList.remove('hide');

    // Hide overlay
    overlay.classList.remove('display');
});


// Dark mode toggler
themeSwitcher.addEventListener('click', () => {
    darkmodeBtn.classList.toggle('on');
    applyDarkMode();
});

// Scroll up button
scrollBtn.addEventListener('click', e => {
    scrollTo(0, 0);
});


// Prevent submit on input field
countryFilter.addEventListener('submit', e => {
    e.preventDefault();
});

// Fetch all countries on page load
window.addEventListener('load', () => {
    fetchData('https://restcountries.eu/rest/v2/all')
       .then(data => {
           generateCardHtml(data);

           // Check local storage for theme settings
           if(localStorage.getItem('mode') === 'dark') {
            darkmodeBtn.classList.add('on');
           }

           applyDarkMode();
        });
});

export { bordersContainer }