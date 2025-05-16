import Fastify from "fastify";
import fastifyCors from '@fastify/cors';
import dotenv from 'dotenv';
import { CreateUsers } from "./app/routes/login_user";
import { DelOders } from "./app/routes/delPedidos";
import { Paytable } from './app/routes/pay_table';
import { RespStatus } from "./app/routes/status";

dotenv.config();

const app = Fastify();
const  PORT = Number(process.env.PORT)

app.register(fastifyCors,{
     origin: 'http://localhost:5173',
     credentials:true,
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
});

app.register(CreateUsers);
app.register(Paytable);
app.register(RespStatus);
app.register(DelOders);

app.listen({port:PORT},(err, address) => {
    if(err) {
        console.error('Erro ao iniciar o servidor',err);
        process.exit(1);
    }
    console.log(`Servidor rodando em ${address}`);
});