const RestaurantService = require('../services/RestaurantService');
const { OrderType } = require('../services/OrderFactory');

class RestaurantController {
    constructor() { this.service = new RestaurantService(); }

    handleRegisterCustomer(name, email) {
        try {
            const customer = this.service.registerCustomer(name, email);
            console.log(`✅ Клієнта "${customer.getName()}" зареєстровано`);
            return { success: true, customer };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    handleAddDish(name, price) {
        try {
            const dish = this.service.addDishToMenu(name, Number(price));
            return { success: true, dish };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    handlePlaceOrder(customerName, dishNames, orderType = OrderType.REGULAR) {
        try {
            const order = this.service.placeOrder(customerName, dishNames, orderType);
            return { success: true, order };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

module.exports = RestaurantController;