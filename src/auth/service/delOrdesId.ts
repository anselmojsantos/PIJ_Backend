import { prisma } from "../../libs/prisma";

interface DelOders{
    id: number;
    table?: string;
} 

export const DelOdersId = async({id, table}:DelOders)=>{    
    const delOrder = await prisma.orders.delete({
        where: {id:id},    
    });

    const upStatusTb = await prisma.tables.update({
        where: {table: table},
        data: {status:"1"},
    });
     
    return delOrder;
}