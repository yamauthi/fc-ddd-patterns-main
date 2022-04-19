import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("20", "hugo");
    const address = new Address("Rua teste", 46, "37310810", "BH");

    customer.changeAddress(address);    
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const laptop = new Product("1", "Alienware X17 R3", 2000)
    const nintendoSwitch = new Product("2", "Nintendo Switch PRO 4K", 400)
    
    await productRepository.create(laptop);
    await productRepository.create(nintendoSwitch);

    const orderItem1 = new OrderItem(
      "1",
      laptop.name,
      laptop.price,
      laptop.id,
      1
    );

    const orderItem2 = new OrderItem(
      "2",
      nintendoSwitch.name,
      nintendoSwitch.price,
      nintendoSwitch.id,
      3
    );

    const orderRepository = new OrderRepository();
    const order = new Order("141210", customer.id, [orderItem1]);
    await orderRepository.create(order);

    const orderModelCreate = await OrderModel.findOne(
      { where: { id: order.id },
      include: ["items"],
    });

    expect(orderModelCreate.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: "141210",
          product_id: orderItem1.productId,
        }
      ]
    });

    order.changeItems([orderItem1, orderItem2]);
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne(
      { where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
        id: order.id,
        customer_id: order.customerId,
        total: order.total(),
        items: [
          {
            id: orderItem1.id,
            name: orderItem1.name,
            price: orderItem1.price,
            quantity: orderItem1.quantity,
            order_id: "141210",
            product_id: orderItem1.productId,
          },
          {
            id: orderItem2.id,
            name: orderItem2.name,
            price: orderItem2.price,
            quantity: orderItem2.quantity,
            order_id: "141210",
            product_id: orderItem2.productId,
          }
        ]
      });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("20", "hugo");
    const address = new Address("Rua teste", 46, "37310810", "BH");

    customer.changeAddress(address);    
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const laptop = new Product("1", "Alienware X17 R3", 2000);
    
    await productRepository.create(laptop);

    const orderItem1 = new OrderItem(
      "1",
      laptop.name,
      laptop.price,
      laptop.id,
      1
    );

    const orderRepository = new OrderRepository();
    const order = new Order("141210", customer.id, [orderItem1]);
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find("141210");

    expect(foundOrder).toEqual(order);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("20", "hugo");
    const address = new Address("Rua teste", 46, "37310810", "BH");

    const customer2 = new Customer("21", "dani");
    const address2 = new Address("Rua testando", 39, "37310850", "BH");

    customer.changeAddress(address);
    customer2.changeAddress(address2);

    await customerRepository.create(customer);
    await customerRepository.create(customer2);

    const productRepository = new ProductRepository();
    const laptop = new Product("1", "Alienware X17 R3", 2000)
    const nintendoSwitch = new Product("2", "Nintendo Switch PRO 4K", 400)
    
    await productRepository.create(laptop);
    await productRepository.create(nintendoSwitch);

    const orderItem1 = new OrderItem(
      "1",
      laptop.name,
      laptop.price,
      laptop.id,
      1
    );

    const orderItem2 = new OrderItem(
      "2",
      nintendoSwitch.name,
      nintendoSwitch.price,
      nintendoSwitch.id,
      3
    );

    const orderItem3 = new OrderItem(
      "3",
      nintendoSwitch.name,
      nintendoSwitch.price,
      nintendoSwitch.id,
      1
    );

    const orderRepository = new OrderRepository();
    const order = new Order("141210", customer.id, [orderItem1, orderItem2]);
    const order2 = new Order("141211", customer2.id, [orderItem3]);

    await orderRepository.create(order);
    await orderRepository.create(order2);

    const orders = [order, order2];

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toEqual(orders);

  });

});
