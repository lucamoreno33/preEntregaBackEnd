import { Router } from "express";
import ProductManager from "../ProductManager.js";

const almacenamiento = new ProductManager('./data/productos.json');

const router = Router();


router.get("/:cid", (req, res) =>{
    const {cid} = req.params;
    const carro = almacenamiento.getCart(cid)
    carro ? res.json(carro) : res.status(404).json({error: "carro no encontrado"})


})
router.post("/", (req, res) => {
    const resultado = almacenamiento.addCart()
    resultado ? res.json("carro añadido correctamente") : res.json({error: "error al agregar el carrito"})
    
    
})

router.post("/:cid/products/:pid", (req, res) =>{
    const {cid, pid} = req.params
    const resultado = almacenamiento.addProductToCart(cid, pid)
    resultado ? res.json("producto agregado exitosamente") : res.status(400).json({error: "producto y/o carro no existente"})
})


export default router