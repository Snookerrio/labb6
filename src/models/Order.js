class Order {
    constructor(customer) {
        if (!customer) throw new Error("Клієнт обов'язковий");
        this.customer = customer;
        this.items = [];
        this.observers = [];
        this.status = 'pending';
        this.createdAt = new Date();
    }
    addObserver(fn) {
        if (typeof fn !== 'function') throw new Error('Спостерігач має бути функцією');
        this.observers.push(fn);
    }
    addItem(dish) { this.items.push(dish); }
    place() { this.status = 'placed'; this.observers.forEach(fn => fn(this)); }
    getCustomer() { return this.customer; }
    getItems() { return [...this.items]; }
    getStatus() { return this.status; }
    getTotalPrice() { return this.items.reduce((sum, d) => sum + d.getPrice(), 0); }
}
module.exports = Order;