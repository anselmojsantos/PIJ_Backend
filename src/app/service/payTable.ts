import { prisma } from "../../libs/prisma";

export const payTable = async()=>{
   const searchTable = await prisma.orders.findMany({
    select:{
        id: true,
        waiter: true,
        table_number: true,
        order_items: true,
        created_at: true,
        status:true,
    }
   });
   const result = searchTable.map(order => {
   
    const items = typeof order.order_items === 'string' 
      ? JSON.parse(order.order_items) 
      : order.order_items;
    
    const processedItems = items.map((item: { price: number; quantity: number }) => ({
      ...item,
      subtotal: item.price * item.quantity
    }));
    return {
      ...order,
      order: processedItems, 
      total: processedItems.reduce((sum: number, item: { subtotal: number }) => sum + item.subtotal, 0)    };
  });

   return result;
}