import {FastifyInstance} from "fastify";
import { DelOdersId } from "../service/delOrdesId";

export const DelOders = async(fastify: FastifyInstance)=>{

    fastify.delete('/del-order', async(req, resp)=>{
        const stOders = req.body as {
            id: number,
            table: string
        }
        const delOrders = await DelOdersId({
            id:stOders.id,
            table:stOders.table
        });
        return resp.send(delOrders);
    });
}