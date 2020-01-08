import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios({
                "method":"GET",
                "url":`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${this.id}/information`,
                "headers":{
                    "content-type":"application/octet-stream",
                    "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                    "x-rapidapi-key":"ad64158c22msh1b86096428d2d7fp19917ejsnd71577ede934"
                }
            });
            
            this.title = res.data.title;
            this.time = res.data.readyInMinutes;
            this.img = res.data.image;
            this.url = res.data.sourceUrl;
            this.servings = res.data.servings;
            this.ingredients = res.data.extendedIngredients; //Array

        } catch (error) {
            console.log(error);
        }
    }

    updateServings(type){
        //Serving
        const newServings = type === 'des' ? this.servings -1 : this.servings +1;
        
        //Ingredients
        this.ingredients.forEach((ing) =>{
            ing.amount = ing.amount * (newServings/this.servings);
        });

        //update this.servings
        this.servings = newServings;
    }
}