import { bordersContainer } from './app';

// ----------- GENERATE CARDS -----------
const generateCardHtml = data => {
  let html = '';
  data.forEach(country => {
    html += `
    <div class="card element">
      <img src=${country.flag} alt="Country flag">
      <div class="info">
        <h5>${country.name}</h5>
        <p>Population: ${country.population.toLocaleString('en-gb')}</p>
        <p>Region: ${country.region}</p>
        <p>Capital: ${country.capital}</p>
      </div>
    </div>
    `;
  });

  // Inject generated HTML into the countries container
  document.querySelector('.cards-section').innerHTML = html;
}

// ----------- UPDATE COUNTRY DETAILS -----------
const updateCountryDetails = data => {
  const flag = document.querySelector('.country-details img');
  const countryName = document.querySelector('.country-name');
  const stats = document.querySelector('.stats');

  const currencies = data.currencies.map(currency => currency.name).join(', ');
  const languages = data.languages.map(currency => currency.name).join(', ');
  const borders = data.borders;

  // Update content with country info
  // Flag & country name
  flag.src = data.flag;
  countryName.textContent = data.name;

  // Country stats
  stats.innerHTML = `
    <ul>
      <li><span class="bold">Native Name</span>: ${data.nativeName}</li>
      <li><span class="bold">Population</span>: ${data.population.toLocaleString('en-gb')}</li>
      <li><span class="bold">Region</span>: ${data.region}</li>
      <li><span class="bold">Sub Region</span>: ${data.subregion}</li>
      <li><span class="bold">Capital</span>: ${data.capital}</li>
    </ul>
    
    <ul>
      <li><span class="bold">Top Level Domain</span>: ${data.topLevelDomain}</li>
      <li><span class="bold">Currencies</span>: ${currencies}</li>
      <li><span class="bold">Languages</span>: ${languages}</li>
    </ul>
  `;

  generateCountryBorders(borders);
}

// ----------- GENERATE COUNTRY BORDERS -----------
const generateCountryBorders = borders => {
  let html = '';

  // If there are less than 4 border countries, generate them all
  if(borders.length > 0 && borders.length < 4) {
    borders.forEach(country => {
      html += `
      <button class="btn element">${country}</button>
      `;
    });
  }
  // If there are more than 4 border countries, generate only 3
  else if(borders.length > 0 && borders.length >= 4) {
    for(let i = 0; i < 3; i++) {
      html += `
      <button class="btn element">${borders[i]}</button>
      `;
    }
  }

  // Inject generated HTML into the borders container
  bordersContainer.innerHTML = html;

  // If there's no border country, insert informative text
  if(borders.length === 0) {
    bordersContainer.innerHTML = `<p class="none">None</p>`;
  }
}

export { generateCardHtml, updateCountryDetails };