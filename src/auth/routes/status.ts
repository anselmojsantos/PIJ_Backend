import {FastifyInstance} from "fastify";
import { statusOrders, statusPay } from "../service/statusOrders";

export const RespStatus = async(fastify: FastifyInstance)=>{

    fastify.post('/status', async(req, resp)=>{
        const stOders = req.body as {
            Id: number;
            newStatus: string;
        }
        const statusList = await statusOrders({
            Id: stOders.Id,
            newStatus: stOders.newStatus
        });
        return resp.send(statusList);
    });

    fastify.post('/status-pay', async(req, resp)=>{
        
        const stOders = req.body as {
            Id: number;
            newStatus: string;
            table: string;
        }
        const statusList = await statusPay({
            Id: stOders.Id,
            newStatus: stOders.newStatus,
            table: stOders.table
        });
        return resp.send(statusList);
    });}
