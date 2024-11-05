const txtCharacter = document.getElementById('txt-character');
const containerCards = document.getElementById('containerCards');
const filters = document.querySelectorAll('#filters input[type="checkbox"]');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const pageNumSpan = document.getElementById('page-num');

const URL1 = "https://rickandmortyapi.com/api/character";
const URL2 = "https://rickandmortyapi.com/api/character/?name=";

let currentPage = 1;
const resultsPerPage = 5;
let allResults = [];

const getApi = async (URL) => {
    const response = await fetch(URL);
    const data = await response.json();
    return data.results;
}

const createCards = (character) => {
    const card = document.createElement('div');
    card.classList.add('card-character');

    const imgCard = document.createElement('img');
    imgCard.src = character.image;
    imgCard.alt = character.name;

    const containerDescription = document.createElement('div');
    containerDescription.classList.add('description-card');

    const nameCharacter = document.createElement('h2');
    nameCharacter.textContent = character.name;

    const genderCharacter = document.createElement('p');
    genderCharacter.textContent = "Gender: " + character.gender;

    containerDescription.appendChild(nameCharacter);
    containerDescription.appendChild(genderCharacter);
    card.appendChild(imgCard);
    card.appendChild(containerDescription);
    containerCards.appendChild(card);
}

const renderResults = (filteredResults) => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    containerCards.innerHTML = '';
    paginatedResults.forEach(character => createCards(character));

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = endIndex >= filteredResults.length;
}

const filterResults = () => {
    const selectedFilters = Array.from(filters)
        .filter(input => input.checked)
        .map(input => input.value);

    const filteredResults = allResults.filter(result =>
        selectedFilters.length === 0 || selectedFilters.includes(result.gender)
    );

    renderResults(filteredResults);
}

const generateAllCharacters = async () => {
    allResults = await getApi(URL1);
    filterResults();
}

const getCharacterByName = async (event) => {
    containerCards.innerHTML = "";
    if (event.target.value === "") {
        filterResults();
    } else {
        allResults = await getApi(URL2 + event.target.value);
        filterResults();
    }
}

filters.forEach(filter => {
    filter.addEventListener('change', () => {
        currentPage = 1;
        filterResults();
    });
});

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        pageNumSpan.textContent = currentPage;
        filterResults();
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    pageNumSpan.textContent = currentPage;
    filterResults();
});

window.addEventListener('DOMContentLoaded', generateAllCharacters);
txtCharacter.addEventListener('keyup', getCharacterByName);



