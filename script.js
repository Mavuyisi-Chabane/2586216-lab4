const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName){

    try{

        errorMessage.textContent = "";
        countryInfo.textContent = "";
        countryInfo.classList.add('hidden');
        borderingCountries.classList.add('hidden');
        borderingCountries.innerHTML = "";
        loadingSpinner.classList.remove('hidden');
        

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if(!response.ok){
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital[0]}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        countryInfo.classList.remove('hidden');

        if(country.borders){
            for(let code of country.borders){
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountries.innerHTML += `
                    <div class="border-card">
                        <h4>${borderCountry.name.common}</h4>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                    <div>
                `;
            }

            borderingCountries.classList.remove('hidden');
        }

    }

    catch (error){
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.style.display = 'block';

    }

    finally{
        loadingSpinner.style.display = 'none';

    }
}

searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if(country){
        searchCountry(country);
    }
});

countryInput.addEventListener('keypress', (e) => {
    if(e.key === "Enter"){
        const country = countryInput.value.trim();
        if(country){
            searchCountry(country);
        }
    }
});