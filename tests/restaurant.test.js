const Dish = require('../src/models/Dish');
const Menu = require('../src/models/Menu');
const Customer = require('../src/models/Customer');
const Order = require('../src/models/Order');
const KitchenNotifier = require('../src/services/KitchenNotifier');
const { OrderFactory, OrderType, BulkOrder } = require('../src/services/OrderFactory');
const RestaurantService = require('../src/services/RestaurantService');
const orderRepository = require('../src/repositories/OrderRepository');
const customerRepository = require('../src/repositories/CustomerRepository');

beforeEach(() => {
    orderRepository.clear();
    customerRepository.clear();
});

test('Тест 1 — Додавання страви до меню', () => {
    const menu = new Menu();
    const dish = new Dish('Піца', 150);
    menu.addDish(dish);
    expect(menu.containsDish(dish)).toBe(true);
});
test('Тест 2 — Порожнє меню не містить страви', () => {
    expect(new Menu().containsDish(new Dish('Борщ', 80))).toBe(false);
});
test('Тест 3 — getDishes() повертає копію', () => {
    const menu = new Menu();
    menu.addDish(new Dish('Суп', 60));
    const copy = menu.getDishes();
    copy.push(new Dish('Зайва', 0));
    expect(menu.getDishes()).toHaveLength(1);
});
test('Тест 4 — Замовлення прив\'язане до клієнта', () => {
    expect(new Order(new Customer('Юрій')).getCustomer().getName()).toBe('Юрій');
});
test('Тест 5 — Додавання страви до замовлення', () => {
    const order = new Order(new Customer('Аня'));
    const dish = new Dish('Салат', 90);
    order.addItem(dish);
    expect(order.getItems()).toContain(dish);
});
test('Тест 6 — Нове замовлення порожнє', () => {
    expect(new Order(new Customer('Тест')).getItems()).toHaveLength(0);
});
test('Тест 7 — Observer викликається при place()', () => {
    const log = [];
    const order = new Order(new Customer('Іван'));
    order.addObserver(o => log.push(o.getCustomer().getName()));
    order.addItem(new Dish('Стейк', 300));
    order.place();
    expect(log).toEqual(['Іван']);
});
test('Тест 8 — Кілька спостерігачів', () => {
    let count = 0;
    const order = new Order(new Customer('Сяо'));
    order.addObserver(() => count++);
    order.addObserver(() => count++);
    order.place();
    expect(count).toBe(2);
});
test('Тест 9 — place() без спостерігачів не кидає помилок', () => {
    expect(() => new Order(new Customer('Пусто')).place()).not.toThrow();
});
test('Тест 10 — Атрибути страви', () => {
    const dish = new Dish('Вареники', 75);
    expect(dish.getName()).toBe('Вареники');
    expect(dish.getPrice()).toBeCloseTo(75);
});
test('Тест 11 — Singleton: один екземпляр репозиторію', () => {
    expect(require('../src/repositories/OrderRepository')).toBe(orderRepository);
});
test('Тест 12 — Singleton: збережене замовлення є у репозиторії', () => {
    orderRepository.save(new Order(new Customer('Ліна')));
    expect(orderRepository.findAll()).toHaveLength(1);
});
test('Тест 13 — Factory: REGULAR не є BulkOrder', () => {
    expect(OrderFactory.createOrder(OrderType.REGULAR, new Customer('Боб'))).not.toBeInstanceOf(BulkOrder);
});
test('Тест 14 — Factory: BULK повертає BulkOrder з quantity=10', () => {
    const o = OrderFactory.createOrder(OrderType.BULK, new Customer('Оптовик'));
    expect(o).toBeInstanceOf(BulkOrder);
    expect(o.getQuantity()).toBe(10);
});
test('Тест 15 — Factory: різні виклики — різні об\'єкти', () => {
    const c = new Customer('Марта');
    expect(OrderFactory.createOrder(OrderType.REGULAR, c)).not.toBe(
        OrderFactory.createOrder(OrderType.REGULAR, c)
    );
});
test('Тест 16 — KitchenNotifier отримує сповіщення', () => {
    const kitchen = new KitchenNotifier();
    const order = new Order(new Customer('Дарина'));
    order.addObserver(o => kitchen.onOrderPlaced(o));
    order.addItem(new Dish('Паста', 120));
    order.place();
    expect(kitchen.getNotifications()).toHaveLength(1);
    expect(kitchen.getNotifications()[0]).toContain('Дарина');
});
test('Тест 17 — Сповіщення містить кількість страв', () => {
    const kitchen = new KitchenNotifier();
    const order = new Order(new Customer('Петро'));
    order.addObserver(o => kitchen.onOrderPlaced(o));
    order.addItem(new Dish('Піца', 150));
    order.addItem(new Dish('Кола', 30));
    order.place();
    expect(kitchen.getNotifications()[0]).toContain('2');
});
test('Тест 18 — Три замовлення → три сповіщення', () => {
    const kitchen = new KitchenNotifier();
    for (let i = 1; i <= 3; i++) {
        const o = new Order(new Customer(`Клієнт${i}`));
        o.addObserver(order => kitchen.onOrderPlaced(order));
        o.place();
    }
    expect(kitchen.getNotifications()).toHaveLength(3);
});
test('Тест 19 — Сервіс: registerCustomer() зберігає клієнта', () => {
    const service = new RestaurantService();
    service.registerCustomer('Злата', 'zlata@mail.com');
    expect(customerRepository.findByName('Злата')).toBeTruthy();
});
test('Тест 20 — Сервіс: повний цикл замовлення', () => {
    const service = new RestaurantService();
    service.registerCustomer('Злата');
    service.addDishToMenu('Суші', 200);
    service.addDishToMenu('Місо суп', 80);
    const order = service.placeOrder('Злата', ['Суші', 'Місо суп']);
    expect(orderRepository.findAll()).toHaveLength(1);
    expect(service.getKitchenNotifications()).toHaveLength(1);
    expect(order.getTotalPrice()).toBeCloseTo(280);
    expect(order.getStatus()).toBe('placed');
});
test('Негативний — placeOrder: клієнт не знайдений', () => {
    const service = new RestaurantService();
    service.addDishToMenu('Піца', 100);
    expect(() => service.placeOrder('НезнайомийКлієнт', ['Піца'])).toThrow('не знайдено');
});
test('Негативний — placeOrder: страва не в меню', () => {
    const service = new RestaurantService();
    service.registerCustomer('Тест');
    expect(() => service.placeOrder('Тест', ['НесправжняСтрава'])).toThrow('не знайдено в меню');
});
test('Негативний — повторна реєстрація клієнта', () => {
    const service = new RestaurantService();
    service.registerCustomer('Дублікат');
    expect(() => service.registerCustomer('Дублікат')).toThrow('вже зареєстрований');
});