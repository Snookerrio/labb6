class Dish {
    constructor(name, price) {
        if (!name || typeof name !== 'string') throw new Error("Назва страви обов'язкова");
        if (typeof price !== 'number' || price < 0) throw new Error('Ціна має бути невід\'ємним числом');
        this.name = name;
        this.price = price;
    }
    getName() { return this.name; }
    getPrice() { return this.price; }
}
module.exports = Dish;