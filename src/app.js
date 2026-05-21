const express = require('express');
const RestaurantService = require('./services/RestaurantService');

const app = express();
app.use(express.json());

const service = new RestaurantService();

// Seed menu on startup
service.addDishToMenu('Піца Маргарита', 150);
service.addDishToMenu('Борщ', 85);
service.addDishToMenu('Стейк', 320);
service.addDishToMenu('Салат Цезар', 110);
service.addDishToMenu('Тірамісу', 90);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/menu', (req, res) => {
    const dishes = service.getMenu().getDishes().map(d => ({
        name: d.getName(), price: d.getPrice()
    }));
    res.json({ dishes });
});

app.post('/menu', (req, res) => {
    try {
        const { name, price } = req.body;
        const dish = service.addDishToMenu(name, Number(price));
        res.status(201).json({ dish: { name: dish.getName(), price: dish.getPrice() } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/customers', (req, res) => {
    try {
        const { name, email } = req.body;
        const customer = service.registerCustomer(name, email);
        res.status(201).json({ customer: { name: customer.getName(), email: customer.getEmail() } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/orders', (req, res) => {
    try {
        const { customerName, dishes } = req.body;
        const order = service.placeOrder(customerName, dishes);
        res.status(201).json({
            order: {
                customer: order.getCustomer().getName(),
                items: order.getItems().map(d => d.getName()),
                total: order.getTotalPrice(),
                status: order.getStatus()
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/orders', (req, res) => {
    const orders = service.getAllOrders().map(o => ({
        customer: o.getCustomer().getName(),
        items: o.getItems().map(d => d.getName()),
        total: o.getTotalPrice(),
        status: o.getStatus()
    }));
    res.json({ orders });
});

app.get('/kitchen/notifications', (req, res) => {
    res.json({ notifications: service.getKitchenNotifications() });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => console.log(`Restaurant API running on port ${PORT}`));
}

module.exports = app;