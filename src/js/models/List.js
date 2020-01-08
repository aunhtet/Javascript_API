import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }

    addItem(amount, unit, name){
        const item ={
            id: uniqid(),
            amount,
            unit,
            name
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        // [2,4,8] splice (1,2) --> return 4, original array is [2]
        // [2,4,8] slice (1,2) --> return 4, original array is [2,4,8]
        const index = this.items.findIndex((el)=> el.id === id);

        this.items.splice(index,1);
    }

    updateAmount(id,newAmount){
        this.items.find((el)=> el.id===id).amount = newAmount;
    }
}