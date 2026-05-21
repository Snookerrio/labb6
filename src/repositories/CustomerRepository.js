class CustomerRepository {
    constructor() { this.customers = []; }
    save(customer) {
        const existing = this.findByName(customer.getName());
        if (existing) throw new Error(`Клієнт "${customer.getName()}" вже зареєстрований`);
        this.customers.push(customer);
        return customer;
    }
    findByName(name) { return this.customers.find(c => c.getName() === name) || null; }
    findAll() { return [...this.customers]; }
    clear() { this.customers = []; }
    count() { return this.customers.length; }
}
module.exports = new CustomerRepository();