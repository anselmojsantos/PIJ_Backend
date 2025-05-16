import {FastifyInstance} from "fastify";
import { payTable } from "../service/payTable";

export const Paytable = async(fastify: FastifyInstance)=>{
    fastify.get('/paytable', async(req, resp)=>{
        const paytable = await payTable();
        return resp.status(200).send({paytable})
    });
    fastify.get('/orders-pay', async(req, resp)=>{
        const paytable = await  payTable();
        return resp.status(200).send({paytable});
    });
};
