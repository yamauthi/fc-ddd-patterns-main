import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
  
    entity.items.forEach((item, index, array) => {
      OrderItemModel.upsert( {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id
        }
      );
    });

    await OrderModel.update(
      { 
        total: entity.total(), }, 
      { where: { id: entity.id, } },
    );

  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ 
      where: { id: id },
      include: ["items"],
    });

    const order = new Order(
      orderModel.id, 
      orderModel.customer_id, 
      orderModel.items.map((item) => {
        return new OrderItem(
          item.id, item.name, item.price, item.product_id, item.quantity
        );
    }));

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ["items"], });

    return orderModels.map((order) => {
      return new Order(
        order.id, 
        order.customer_id, 
        order.items.map((item) => {
          return new OrderItem(
            item.id, item.name, item.price, item.product_id, item.quantity
          );
      }));
      
    }); 
  }

}
