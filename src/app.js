import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import {Server} from "socket.io";
import routerCart from "./routes/cart.router.js";
import routerProducts from "./routes/products.router.js";
import productManager from "./productManager.js";

const pml = new productManager("./src/listadoDeProductos.json");
const app = express();
const httpServer = app.listen(8080, () =>
	console.log("Server running in port 8080")
);
//const routerCart = require("./routes/cart.router.js");
//const routerProducts = require("./routes/products.router.js")
//const routerCart = require ("./routes/cart.router.js")

//socketServer
const socketServer = new Server(httpServer);

const productsData = {products: pml.getProducts()};

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
socketServer.on("connection", async (socket) => {
	console.log("nuevo cliente conectado");
	try {
		// Emitir productos al cliente cuando se conecta
		const initialProducts = {products: await pml.getProducts()};
		console.log("Productos iniciales enviados:", initialProducts);
		socket.emit("products", initialProducts);
	} catch (error) {
		console.error("Error al obtener productos iniciales:", error.message);
		socket.emit("error");
	}

	//Escucho evento para agregar producto

	socket.on("add_product", async (producto) => {
		try {
			//Si se agrega el producto se envía evento de confirmación
			await pml.addProduct(producto);
			socket.emit("success");
			const updatedProducts = {products: pml.getProducts()};
			console.log("Productos actualizados enviados:", updatedProducts);
			socketServer.emit("products", updatedProducts);
		} catch {
			//Si hay un fallo al agregar el producto se envía evento de error
			socket.emit("error");
		}
	});
	//Envio evento para renderizar la lista de productos a la nueva conexion
});

//Reglas para ver q funcione el servidor
app.get("/ping", (req, res) => {
	res.send("Pong");
});
app.get("/", (req, res) => {
	res.status(200).send("<h1>AYELÉN LUZ ANCA GULLA</h1>");
});
