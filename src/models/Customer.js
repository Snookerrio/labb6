class Customer {
    constructor(name, email) {
        if (!name || typeof name !== 'string') throw new Error("Ім'я клієнта обов'язкове");
        this.name = name;
        this.email = email || null;
    }
    getName() { return this.name; }
    getEmail() { return this.email; }
}
module.exports = Customer;