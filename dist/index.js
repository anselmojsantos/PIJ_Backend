"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_fastify = __toESM(require("fastify"));
var import_cors = __toESM(require("@fastify/cors"));
var import_dotenv = __toESM(require("dotenv"));

// src/libs/prisma.ts
var import_client = require("@prisma/client");
var prisma = globalThis.prisma || new import_client.PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// src/app/service/createUser.ts
var bcrypt = __toESM(require("bcrypt"));
var createUser = async (data) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    const user = await prisma.logdash.create({
      data: {
        ...data,
        password: hash
      }
    });
    return { user: true };
  } catch (error) {
    return false;
  }
};

// src/app/search/authUser.ts
var bcrypt2 = __toESM(require("bcrypt"));
var authUser = async (credentials) => {
  try {
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        message: "Email e senha s\xE3o obrigat\xF3rios!"
      };
    }
    const user = await prisma.logdash.findUnique({
      where: {
        email: credentials.email
      }
    });
    if (!user) {
      return {
        success: false,
        message: "Email n\xE3o encontrado. Verifique e tente novamente."
      };
    }
    ;
    const passwordMatch = await bcrypt2.compare(
      credentials.password,
      user.password
    );
    if (!passwordMatch) {
      return {
        success: false,
        message: "Senha errada. Tente novamente."
      };
    }
    ;
    const { password, ...userPassword } = user;
    return {
      success: true,
      message: "Login realizada com sucesso!",
      user: {
        id: user.id,
        name: user.name
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro na autentica\xE7\xE3o. Tente novamente mais tarde!"
    };
  }
};

// src/app/routes/login_user.ts
var CreateUsers = async (fastify) => {
  fastify.get("/", (request, reply) => {
    reply.send("Servidor Rodando com sucesso!");
  });
  fastify.post("/createuser", async (req, resp) => {
    const user = await createUser({
      name: "Anselmo Santos",
      email: "anselmo3.santos@gmail.com",
      password: "123456"
    });
    console.log(user);
    return resp.status(200).send({ user });
  });
  fastify.post("/login", async (req, resp) => {
    const { email, password } = req.body;
    const user = await authUser({
      email,
      password
    });
    console.log(user);
    return resp.status(201).send({ user });
  });
};

// src/app/service/delOrdesId.ts
var DelOdersId = async ({ id, table }) => {
  const delOrder = await prisma.orders.delete({
    where: { id }
  });
  const upStatusTb = await prisma.tables.update({
    where: { table },
    data: { status: "1" }
  });
  return delOrder;
};

// src/app/routes/delPedidos.ts
var DelOders = async (fastify) => {
  fastify.delete("/del-order", async (req, resp) => {
    const stOders = req.body;
    const delOrders = await DelOdersId({
      id: stOders.id,
      table: stOders.table
    });
    return resp.send(delOrders);
  });
};

// src/app/service/payTable.ts
var payTable = async () => {
  const searchTable = await prisma.orders.findMany({
    select: {
      id: true,
      waiter: true,
      table_number: true,
      order_items: true,
      created_at: true,
      status: true
    }
  });
  const result = searchTable.map((order) => {
    const items = typeof order.order_items === "string" ? JSON.parse(order.order_items) : order.order_items;
    const processedItems = items.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity
    }));
    return {
      ...order,
      order: processedItems,
      total: processedItems.reduce((sum, item) => sum + item.subtotal, 0)
    };
  });
  return result;
};

// src/app/routes/pay_table.ts
var Paytable = async (fastify) => {
  fastify.get("/paytable", async (req, resp) => {
    const paytable = await payTable();
    return resp.status(200).send({ paytable });
  });
  fastify.get("/orders-pay", async (req, resp) => {
    const paytable = await payTable();
    return resp.status(200).send({ paytable });
  });
};

// src/app/service/statusOrders.ts
var statusOrders = async ({ Id, newStatus }) => {
  const updteStatus = await prisma.orders.update({
    where: { id: Id },
    data: { status: newStatus }
  });
  return updteStatus;
};
var statusPay = async ({ Id, newStatus, table }) => {
  const updteStatus = await prisma.orders.update({
    where: { id: Id },
    data: { statuspay: newStatus }
  });
  const upStatusTb = await prisma.tables_.update({
    where: { table_number: table },
    data: { status: "1" }
  });
  return updteStatus;
};

// src/app/routes/status.ts
var RespStatus = async (fastify) => {
  fastify.post("/status", async (req, resp) => {
    const stOders = req.body;
    const statusList = await statusOrders({
      Id: stOders.Id,
      newStatus: stOders.newStatus
    });
    return resp.send(statusList);
  });
  fastify.post("/status-pay", async (req, resp) => {
    const stOders = req.body;
    const statusList = await statusPay({
      Id: stOders.Id,
      newStatus: stOders.newStatus,
      table: stOders.table
    });
    return resp.send(statusList);
  });
};

// src/index.ts
import_dotenv.default.config();
var app = (0, import_fastify.default)();
var PORT = Number(process.env.PORT);
app.register(import_cors.default, {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
});
app.register(CreateUsers);
app.register(Paytable);
app.register(RespStatus);
app.register(DelOders);
app.listen(
  {
    host: "0.0.0.0",
    port: PORT
  },
  (err, address) => {
    if (err) {
      console.error("Erro ao iniciar o servidor", err);
      process.exit(1);
    }
    console.log(`Server Runing ${address}`);
  }
);
