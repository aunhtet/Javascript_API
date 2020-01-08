// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';

import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - current recipe object
 * - Shopping list object
 * - liked recipes
 */
const state = {};


//SEARCH CONTROLLER
//-----------------
const controlSearch = async () => {
    //1. Get query from view
    const query = searchView.getInput();

    if (query){
        //2. New search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for result
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        //4. Search for recipes
        await state.search.getResult();

        //5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', (e) =>{
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result,goToPage);
    }
})

//RECIPE CONTROLLER
//-----------------
const controlRecipe = async () => {
    //Get the ID from URL
    const id = window.location.hash.replace('#','');
    if (id){
        //prepare UI for changes
        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        recipeView.clearRecipe();

        //Create new recipe object
        state.recipe = new Recipe(id);
        try{
            //Get recipe data
            await state.recipe.getRecipe();
            
            // Calculate servings
            //state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));

            //console.log(state.recipe);


        } catch (err) {
            alert(err);
        }
    }
}

//INGREDIENTS LIST CONTROLLER
//----------------------------

const controlList = () => {
    //Create a new list if there is no one yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach((el)=>{
        const item = state.list.addItem(el.amount,el.unit,el.name);
        listView.renderItem(item);
    });
};

//Handle delete and update list item events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);
        
        //Delete from UI 
        listView.deleteItem(id);

        //Handle the amount update
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateAmount(id,val);
    }
});

//LIKE CONTROLLER
//----------------------------
const controlLikes = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has not yet like current recipe
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike = state.likes.addLike(currentID,state.recipe.title,state.recipe.time,state.recipe.img);
        //Toggle the like button
        likeView.toggleLikeBtn(true);
        //Add like to UI list 
        likeView.renderLike(newLike);
    }else {
    //user has liked current recipe
        //Remove like from the state
        state.likes.deleteLike();

        //Toggle the like button
        likeView.toggleLikeBtn(false);
        //Remove like from UI list 
        likeView.deleteLike(currentID);
    }

    likeView.toggleLikeMenu(state.likes.getNumLikes());

};

window.addEventListener('load', ()=>{

    window.location.hash = '';
    window.location.href.replace('#','');
    
    state.likes = new Likes();
    //Restore Likes
    state.likes.readStorage();

    //Toggle like menu 
    likeView.toggleLikeMenu(state.likes.getNumLikes());

    //Render exisiting likes
    state.likes.likes.forEach((like)=>likeView.renderLike(like));
})

window.addEventListener('hashchange',controlRecipe);

//handling recipe serving butoon clicks
elements.recipe.addEventListener('click', e =>{
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button click
        if (state.recipe.servings > 1){
            state.recipe.updateServings('des');
            recipeView.updateServingsIngredients(state.recipe);
        }        
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }else if (e.target.matches('.recipe__btn__add, .recipe__btn__add *')){
        //console.log('Click on ' + e.target);
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes();
    }
});












