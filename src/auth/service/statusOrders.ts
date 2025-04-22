import { Prisma } from "@prisma/client";
import { prisma } from "../../libs/prisma";

interface UpListOrd{
    Id: number;
    newStatus: string;
    table?: string;
    status?:number;
} 

export const statusOrders = async({Id, newStatus}:UpListOrd)=>{
    const updteStatus = await prisma.orders.update({
        where: {id:Id},
        data: {status: newStatus},

    });
    return updteStatus;
}

export const statusPay = async({Id, newStatus, table}:UpListOrd)=>{
    const updteStatus = await prisma.orders.update({
        where: {id:Id},
        data: {statuspay: newStatus},
    });
    const upStatusTb = await prisma.tables.update({
        where: {table: table},
        data: {status:"1"},
    });
    return updteStatus;
}