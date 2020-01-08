import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResult(){
        try{
            const res = await axios({
                "method":"GET",
                "url":"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search",
                "headers":{
                    "content-type":"application/octet-stream",
                    "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                    "x-rapidapi-key":"ad64158c22msh1b86096428d2d7fp19917ejsnd71577ede934"
                },
                "params":{
                    "query":`${this.query}`
                }
                //image base url https://spoonacular.com/recipeImages/
            });
            //console.log(res);
            this.result = res.data.results;            
        } catch (error) {
            alert(error);
        }    
    }
}