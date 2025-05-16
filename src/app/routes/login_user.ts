import {FastifyInstance} from "fastify";
import {createUser} from "../service/createUser";
import { authUser } from "../search/authUser";


export const CreateUsers = async(fastify: FastifyInstance)=>{
    fastify.get('/',(request,reply)=>{
        reply.send("Servidor Rodando com sucesso!")
    });
    fastify.post('/createuser', async(req, resp)=>{
        const user = await createUser({
            name: 'Anselmo Santos', 
            email:'anselmo3.santos@gmail.com',
            password:'123456'
        });
        console.log(user)
        return resp.status(200).send({user});
    });
    fastify.post('/login', async(req, resp)=>{
        const { email, password } = req.body as {
            email: string;
            password: string;
        };
        const user = await authUser({
            email,
            password     
        });

        console.log(user)
        return resp.status(201).send({user});
    });
}
