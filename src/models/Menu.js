class Menu {
    constructor() { this.dishes = []; }
    addDish(dish) { this.dishes.push(dish); }
    containsDish(dish) { return this.dishes.includes(dish); }
    getDishes() { return [...this.dishes]; }
    findByName(name) {
        return this.dishes.find(d => d.getName().toLowerCase() === name.toLowerCase()) || null;
    }
}
module.exports = Menu;