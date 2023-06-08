import { Router } from "express";
import ProductManager from "../ProductManager.js";

const almacenamiento = new ProductManager('./data/productos.json');
const productos = almacenamiento.getProducts()
const router = Router();


router.get("/", (req, res) => {
    const {limit} = req.query;
    const pedido = productos.slice(0, limit);
    res.send(pedido);
});

router.get("/:pid", (req, res) =>{
    const {pid} = req.params;
    const pedido = productos.find(e => e.id == pid);
    res.send(pedido);
})

router.post("/", (req, res) => {
    const product = req.body;   
    const requiredParams = ['title', 'description','status', 'price', 'category', 'code', 'stock'];
    const missingParams = requiredParams.filter(param => !(param in product));

    if (missingParams.length === 0) {
            almacenamiento.addProduct(product);
            return res.status(201).json(product);
            }
    res.status(400).json( {error: `Faltan los siguientes parámetros: ${missingParams.join(', ')}` } );
})

router.put("/:pid", (req, res) => {
    
    const { pid } = req.params;
    console.log(pid)
    const { title, description, thumbnails, price, stock, code, status } = req.body;
    const propiedades = { 
            title,
            description,
            thumbnails,
            price,
            stock,
            code,
            status
    };
    const mensaje = almacenamiento.updateProduct(pid, propiedades);
    if (mensaje == 'El producto fue actualizado correctamente!'){
            res.status(200).json({ mensaje }); 
    } else res.status(404).json({ mensaje })
    
});

router.delete("/:pid", (req, res) =>{
    const { pid } = req.params;
    const mensaje = almacenamiento.deleteProduct(pid)
    if (mensaje == 'Producto eliminado correctamente'){
            res.status(200).json(mensaje)
    }else{
            res.status(404).json({error: mensaje})
    }
    
    

})



export default router