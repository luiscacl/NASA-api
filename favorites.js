// Get DOM elements
const template = document.querySelector('.template-container');
const pageContainer = document.querySelector('.page-container');

let favoriteSections = []; 

if (localStorage.getItem('favorites')) {
    // Get bookmarks from localStorage
    favoriteSections = JSON.parse(localStorage.getItem('favorites'));

    if(favoriteSections.length > 0){
        renderFavoriteElements();
    }
}

function renderFavoriteElements(){
    pageContainer.innerHTML = '';

    if(favoriteSections.length > 0){
        for (let i = 0; i < favoriteSections.length; i++) {
            const data = favoriteSections[i];
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
            addFavorites.addEventListener('click', removeSectionFromLocalStorage.bind(null, data));
            
            pageContainer.append(templateCopy);
        }
    } else{
        pageContainer.innerHTML = `<h1>------------------You haven't added anything to favorites------------------</h1>`;
    }
}

function removeSectionFromLocalStorage(data){
    // Delete section from
    for (let i = 0; i < favoriteSections.length; i++) {
        const section = favoriteSections[i];
        if(section.url === data.url){
            favoriteSections.splice(i, 1);
            localStorage.setItem('favorites', JSON.stringify(favoriteSections));
            renderFavoriteElements();
            console.log(favoriteSections);
            return;
        }
    }
}