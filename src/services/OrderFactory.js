const Order = require('../models/Order');

const OrderType = { REGULAR: 'REGULAR', BULK: 'BULK' };

class BulkOrder extends Order {
    constructor(customer, quantity = 10) { super(customer); this.quantity = quantity; }
    getQuantity() { return this.quantity; }
}

class OrderFactory {
    static createOrder(type, customer) {
        switch (type) {
            case OrderType.REGULAR: return new Order(customer);
            case OrderType.BULK:    return new BulkOrder(customer, 10);
            default: throw new Error(`Невідомий тип замовлення: ${type}`);
        }
    }
}

module.exports = { OrderFactory, OrderType, BulkOrder };