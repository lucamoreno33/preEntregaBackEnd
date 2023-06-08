import { readFileSync, writeFileSync, existsSync } from 'node:fs';

class ProductManager {
    static #id;
    static #cartsId = 0
    #products;
    #path;
    #carts;
    #cartPath
    constructor() {
        this.#path = './data/productos.json';
        this.#cartPath = './data/carts.json'
        this.#products = this.#leerArchivo(this.#path);
        this.#carts = this.#leerArchivo(this.#cartPath)
        if (this.#products.length > 0) {
            const maxId = Math.max(...this.#products.map(p => p.id));
            ProductManager.#id = maxId;
        }
        if (this.#carts.length > 0) {
            const maxId = Math.max(...this.#carts.map(p => p.id));
            ProductManager.#cartsId = maxId;
        }}

    #leerArchivo(path) {
        try {
            let data;
            if (existsSync(path))
                data = JSON.parse(readFileSync(path, 'utf-8'));
            else
                data = [];

            return data;
        } catch (error) {
            console.log(error);
        }
    }

    addProduct(product) {
        try {
            let mensaje;
            const existeCodigo = this.#products.some(p => p.code === product.code);

            if (existeCodigo)
                mensaje = `El codigo del producto ${product.code} ya existe.`;
            else {
                const newProduct = {
                    id: ++ProductManager.#id,
                    title: product.title,
                    status: product.status || true,
                    description: product.description,
                    price: product.price,
                    thumbnails: [product.thumbnails] || [],
                    code: product.code,
                    stock: product.stock,
                };

                if (!Object.values(newProduct).includes(undefined)) {
                    this.#products.push(newProduct);
                    writeFileSync(this.#path, JSON.stringify(this.#products));
                    mensaje = 'Producto agregado exitosamente!';
                } else
                    mensaje = "Se requiere completar todos los campos";

            }

            return mensaje;
        } catch (error) {
            console.log(error);
        }
    }
    getProducts = () => this.#products

    
    getProductById(id) {
        const productoId = this.#products.find(p => p.id === id);

        return productoId ? productoId : `El producto con ID ${id} no existe.`;
    }

    updateProduct(id, propiedades) {

        try {
            let mensaje;

            const indice = this.#products.findIndex(p => p.id == id);
            if (indice != -1) {
                const { id, ...rest } = propiedades;
                this.#products[indice] = { ...this.#products[indice], ...rest };
                writeFileSync(this.#path, JSON.stringify(this.#products));
                mensaje = 'El producto fue actualizado correctamente!'
            } else
                mensaje = `El producto con ID ${id} no existe`;

            return mensaje;
        } catch (error) {
            console.log(error);
        }
    }

    deleteProduct(id) {
        try {
            let mensaje;
            const producto = this.#products.find((product) => product.id == id)
            console.log(producto)
            if (producto) {
                const index = this.#products.indexOf(producto);
                this.#products.splice(index, 1);
                writeFileSync(this.#path, JSON.stringify(this.#products));
                mensaje = 'Producto eliminado correctamente';
                } 
            else {
                mensaje = `El producto con ID ${id} no existe`;
            }
        return mensaje
    }
    catch (error) {
        console.error('Error al eliminar el producto:', error)
    }
    }
    getCart(cid){
        try {
            const wantedCart = this.#carts.find((cart) => cart.id == cid)
            return wantedCart
        } catch (error) {
            console.log(error)
            return false
        }
        
    }
    addCart(){
        try {
            const newCart = {
                id: ++ProductManager.#cartsId,
                products:[]
            }
            this.#carts.push(newCart);
            writeFileSync(this.#cartPath, JSON.stringify(this.#carts));
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    addProductToCart(cartId, productId ){
        try {
            const carro = this.#carts.find((cart) => cart.id == cartId)
            const product = this.#products.find((product) => product.id == productId)

            const indice = carro.products.findIndex(p => p.id == product.id);
                if (indice != -1) {
                    carro.products[indice].quantity++
                    writeFileSync(this.#cartPath, JSON.stringify(this.#carts))
                    return
                }else{
                    const productoMini = {
                        id: product.id,
                        quantity: 1
                    }
                    carro.products.push(productoMini);
                    writeFileSync(this.#cartPath, JSON.stringify(this.#carts))
            }
            return true
        } catch (error) {
            return false
        }
    }
}
export default ProductManager