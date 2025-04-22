import Fastify from "fastify";
import fastifyCors from '@fastify/cors';
import dotenv from 'dotenv';
import { createUsers } from "./auth/routes/login_user";
import { DelOders } from "./auth/routes/delPedidos";
import { Paytable } from './auth/routes/pay_table';
import { RespStatus } from "./auth/routes/status";

dotenv.config();

const app = Fastify();
const  PORT = Number(process.env.PORT)

app.register(fastifyCors,{
     origin: 'http://localhost:5173',
     credentials:true,
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
});

app.register(createUsers);
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