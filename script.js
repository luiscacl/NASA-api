// Get DOM elements
const template = document.querySelector('.template-content');
const loadMoreButton = document.querySelector('.load-more');
const sectionAddedContainer = document.querySelector('.section-added');
const columnOne = document.querySelector('.column-one');
const columnTwo = document.querySelector('.column-two');
const pageContainer = document.querySelector('.page-container');
const loadingGif = document.querySelector('.loading-page');

// URL API request
const count = 6;
const key = 'L5TNBbAf83LvqilliOTttSDLFOiDoDs1oRDjNDSr';
const url = `https://api.nasa.gov/planetary/apod?api_key=${key}&count=${count}`;
let nasaDataApi = [];

async function getApiData(){
    // Load gif before petition
    loadingGif.setAttribute('style', 'display: flex');
    try{
        const response = await fetch(url);
        nasaDataApi = await response.json();

        renderApiDataElements();
        // Delete gif afret petition
        loadingGif.setAttribute('style', 'display: none');

        console.log(nasaDataApi);
    } catch(error){
        console.log(error);
    }
}

getApiData();

function renderApiDataElements(){
    for (let i = 0; i < nasaDataApi.length; i++) {
        const data = nasaDataApi[i];
        const templateCopy = template.cloneNode(true).content;
        if(data.copyright){
            templateCopy.firstElementChild.querySelector('.author').textContent = data.copyright;
        }
        templateCopy.firstElementChild.querySelector('.image-container img').src = data.url;
        templateCopy.firstElementChild.querySelector('#link-img').href = data.url;
        templateCopy.firstElementChild.querySelector('.title').textContent = data.title;
        templateCopy.firstElementChild.querySelector('.content').textContent = data.explanation;
        templateCopy.firstElementChild.querySelector('.date').textContent = data.date;
        const addFavorites = templateCopy.firstElementChild.querySelector('.add-favorites');

        // Event listener to Add Favorites
        addFavorites.addEventListener('click', addSectionToLocalStorage.bind(null, data));
        
        appendColumnLogic(templateCopy);
    }
}

function appendColumnLogic(template){
    const columns = pageContainer.children;
    const sectionCountPerColumn = [];
    console.log(pageContainer.children);

    // Loop to count how many sections are in each column
    for (let i = 0; i < columns.length; i++) {
        sectionCountPerColumn.push(columns[i].children.length);
    }

    // Constant to see the column that has the minimum amount of sections
    const minSectionCount = Math.min.apply(null, sectionCountPerColumn);

    // Loop to append the template in the correct column
    for (let i = 0; i < columns.length; i++) {
        if(minSectionCount === columns[i].children.length){
            console.log(columns[i]);
            columns[i].append(template);
            break;
        }
    }
}

let favoriteSections = [];
if (!localStorage.getItem('favorites')) {
    // Local Storage
    localStorage.setItem('favorites', JSON.stringify(favoriteSections)); 
    
    console.log(favoriteSections, 'creación local storage');
    
} else if(localStorage.getItem('favorites')){
    // Get favorites from localStorage
    favoriteSections = JSON.parse(localStorage.getItem('favorites'));
}

function addSectionToLocalStorage(dataToStorage){
    // Check if the array is empty or not
    if(favoriteSections.length > 0){
        // Check if a section has been hadded in local storage or not
        for (let i = 0; i < favoriteSections.length; i++) {
            const section = favoriteSections[i];
            if(section.url === dataToStorage.url){
                // console.log('si esta');
                return;
            }
        }
        // console.log('no esta');
        favoriteSections.push(dataToStorage);
        localStorage.setItem('favorites', JSON.stringify(favoriteSections)); 
        sectionAddedMessage();
    } else{
        favoriteSections.push(dataToStorage);
        localStorage.setItem('favorites', JSON.stringify(favoriteSections));
        sectionAddedMessage();
    }
}

function sectionAddedMessage(){
    sectionAddedContainer.setAttribute('style', 'display: flex');
    setTimeout(() => {
    sectionAddedContainer.setAttribute('style', 'display: none');
    },1000);
}

// EVENTS
loadMoreButton.addEventListener('click', getApiData);
