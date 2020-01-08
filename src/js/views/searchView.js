import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value ='';
};

export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = (id) => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach((el) =>{
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

//Pasta with tomato and spinach
//accumalator = 0 , acc + cur.lenght = 5 'Pasta'/ newTitle =['Pasta']
//accumalator = 5 , acc + cur.lenght = 4 'with'/ newTitle =['Pasta','with']
//accumalator = 9 , acc + cur.lenght = 15 'tomato'/ newTitle =['Pasta','with','tomato']
//accumalator = 15 , acc + cur.lenght = 18 'tomato'/ newTitle =['Pasta','with','tomato','and']

export const limitRecipeTitle = (title,limit =17) => {
    const newTitle = []; //Const array and object can update 
    if (title.length > limit){
        title.split(' ').reduce ((acc, cur)=>{
            if (acc + cur.length <= limit ){
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = (recipes) => {
    const imageBaseURL = 'https://spoonacular.com/recipeImages/';
    const markup = `
    <li>
        <a class="results__link" href="#${recipes.id}">
            <figure class="results__fig">
                <img src="${imageBaseURL}${recipes.image}" alt="${recipes.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipes.title)}</h4>
                <p class="results__author">Total time taken ${recipes.readyInMinutes}</p>
            </div>
        </a>
    </li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend',markup);
}

//type: 'prev' or 'next' 
const createButton = (page,type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type ==='prev'? page -1: page +1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type ==='prev'? 'left': 'right'}"></use>
        </svg>
        <span>Page ${type ==='prev'? page -1: page +1}</span>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1){
        //(First Page) Only want the 'Button' to go to next page
        button = createButton(page,'next');

    } else if (page < pages) {
        // We want both previous and next 'Button's
        button = `
            ${button = createButton(page,'next')}
            ${button = createButton(page,'prev')}
        `;

    } else if (page === pages && pages > 1){
        //(Last page) Only want the 'Button' to go to previous page
        button = createButton(page,'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}

export const renderResults = (recipes, page = 1, resPerPage = 4) => {
    // render result of current page
    const start = (page -1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start,end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page,recipes.length,resPerPage);
}