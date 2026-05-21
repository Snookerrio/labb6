class KitchenNotifier {
    constructor() { this.notifications = []; }
    onOrderPlaced(order) {
        const msg = `[Кухня] Нове замовлення від: ${order.getCustomer().getName()}. Страв: ${order.getItems().length}. Сума: ${order.getTotalPrice()} грн`;
        this.notifications.push(msg);
        console.log(msg);
    }
    getNotifications() { return [...this.notifications]; }
    clear() { this.notifications = []; }
}
module.exports = KitchenNotifier;