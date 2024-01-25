import fileSystem from "fs";

const fs = fileSystem.promises;

// CLASE
class productManager {
	constructor(archivo) {
		this.path = archivo;

		//this.products = [];
	}
	static id = 0;

	addProduct = async ({
		title,
		description,
		price,
		thumbnail = [],
		code,
		stock,
		status = true,
		category,
	}) => {
		// ver codigo repetido
		let colecciones = await this.getProducts();
		let codeRep = colecciones.some((i) => i.code === code);
		if (codeRep) {
			console.log(`Error, code ${code} esta repetido.`);
		} else {
			const newProduct = {
				title: title,
				description: description,
				price: price,
				thumbnail: thumbnail,
				code: code,
				stock: stock,
				status: status,
				category: category,
			};
			// Comprueba que todos los campos sean obligatorios.
			console.log(newProduct);
			if (!Object.values(newProduct).includes(undefined)) {
				// Encontrar el ID máximo y sumarle 1
				const newId =
					colecciones.reduce(
						(idMax, product) => (idMax > product.id ? idMax : product.id),
						0
					) + 1;
				productManager.id++; // Con cada producto nuevo, aumenta el ID en la clase en uno, de esta forma no se repiten.
				colecciones.push({
					...newProduct,
					id: newId,
				});
				await fs.writeFile(this.path, JSON.stringify(colecciones));
			} else {
				console.log(
					`Por favor, completar los campos faltantes del producto "${title}"`
				);
			}
		}
	};

	getProducts = async () => {
		try {
			let colecciones = await fs.readFile(this.path, "utf-8");
			return JSON.parse(colecciones);
		} catch (error) {
			if (error.code === "ENOENT") {
				// Si el archivo no existe, retornar un array vacío
				return [];
			} else {
				// Si ocurre un error diferente, lanzar el error
				throw error;
			}
		}
	};

	getProductById = async (id) => {
		let colecciones = await this.getProducts();
		if (!colecciones.find((i) => i.id == id)) {
			console.log(`Producto con ID: "${id}", no existe.`);
			return `Producto "${id}", no existe.`;
		} else {
			console.log(colecciones.find((i) => i.id == id));
			return colecciones.find((i) => i.id == id);
		}
	};

	deleteProduct = async (id) => {
		let colecciones = await this.getProducts();

		let listaNueva = colecciones.filter((i) => i.id !== id);
		await fs.writeFile(this.path, JSON.stringify(listaNueva));
	};

	updateProduct = async (id, campo, valor) => {
		try {
			const colecciones = await this.getProducts();
			const producto = colecciones.find((i) => i.id == id);

			if (producto) {
				producto[campo] = valor;
				await fs.writeFile(this.path, JSON.stringify(colecciones));
				console.log(`Producto con ID ${id} actualizado con éxito.`);
			} else {
				console.log(`No se encontró el producto con ID: ${id}`);
			}
		} catch (error) {
			console.error(error);
		}
	};
}

//exportar
export default productManager;
