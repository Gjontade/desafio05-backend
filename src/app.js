import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import {Server} from "socket.io";
import routerCart from "./routes/cart.router.js";
import routerProducts from "./routes/products.router.js";

const app = express();
const httpServer = app.listen(8080, () =>
	console.log("Server running in port 8080")
);
//const routerCart = require("./routes/cart.router.js");
//const routerProducts = require("./routes/products.router.js")
//const routerCart = require ("./routes/cart.router.js")

//socketServer
const socketServer = new Server(httpServer);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//los use para las clases pero no se muy bien que fin tienen
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Rutas
app.use("/", routerProducts);
app.use("/", routerCart);
app.use("/", viewsRouter);

//coneccion socket
socketServer.on("connection", (socket) => {});

//Reglas para ver q funcione el servidor
app.get("/ping", (req, res) => {
	res.send("Pong");
});
app.get("/", (req, res) => {
	res.status(200).send("<h1>GONZALO FEDERICO JONTADE</h1>");
});
