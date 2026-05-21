const Customer = require('../models/Customer');
const Dish = require('../models/Dish');
const Menu = require('../models/Menu');
const orderRepository = require('../repositories/OrderRepository');
const customerRepository = require('../repositories/CustomerRepository');
const KitchenNotifier = require('./KitchenNotifier');
const { OrderFactory, OrderType } = require('./OrderFactory');

class RestaurantService {
    constructor() {
        this.menu = new Menu();
        this.kitchenNotifier = new KitchenNotifier();
    }

    registerCustomer(name, email) {
        if (!name) throw new Error("Ім'я клієнта обов'язкове");
        const customer = new Customer(name, email);
        return customerRepository.save(customer);
    }

    addDishToMenu(name, price) {
        const dish = new Dish(name, price);
        this.menu.addDish(dish);
        return dish;
    }

    findDishByName(name) {
        const dish = this.menu.findByName(name);
        if (!dish) throw new Error(`Страву "${name}" не знайдено в меню`);
        return dish;
    }

    placeOrder(customerName, dishNames, orderType = OrderType.REGULAR) {
        const customer = customerRepository.findByName(customerName);
        if (!customer) throw new Error(`Клієнта "${customerName}" не знайдено`);
        const order = OrderFactory.createOrder(orderType, customer);
        order.addObserver((o) => this.kitchenNotifier.onOrderPlaced(o));
        for (const dishName of dishNames) {
            const dish = this.menu.findByName(dishName);
            if (!dish) throw new Error(`Страву "${dishName}" не знайдено в меню`);
            order.addItem(dish);
        }
        if (order.getItems().length === 0) throw new Error('Замовлення не може бути порожнім');
        order.place();
        orderRepository.save(order);
        return order;
    }

    getAllOrders()            { return orderRepository.findAll(); }
    getMenu()                 { return this.menu; }
    getKitchenNotifications() { return this.kitchenNotifier.getNotifications(); }
}

module.exports = RestaurantService;