import { prisma } from "../../libs/prisma";

export const payTable = async()=>{
   const searchTable = await prisma.orders.findMany({
    select:{
        id: true,
        waiter: true,
        table: true,
        order: true,
        createdAt: true,
        status:true,
        statuspay:true
    }
   });
   const result = searchTable.map(order => {
   
    const items = typeof order.order === 'string' 
      ? JSON.parse(order.order) 
      : order.order;
    
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