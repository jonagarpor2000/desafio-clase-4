/***
 * @typedef {Object} Product
 * @property {number} id identificador autoincremental
 * @property {string} title titulo del producto
 * @property {string} description (Descripcion del producto)
 * @property {number} price (precio del producto)
 * @property {string} thumbnail (ruta de imagen)
 * @property {string} code (código identificador)
 * @property {number} stock (número de piezas disponibles)
 */

/**
 *  @constant
 *  @default
 */

class ProductManager{

 /**
     * @type {Array<Product>}
     */
 #products;
#error;

 constructor(){
     this.#products = [];
     this.#error=undefined;
 }
getProducts(){
    return this.#products;
}

addProduct(title,description,price,thumbnail,code,stock){
    let valor = this.#validateProductEntries(title, description, price, thumbnail,code,stock)
    if (this.#error === undefined){ 
        /** @type {Product}*/
            const producto = {
            id: this.#getNextId(),
            title, 
            description, 
            price,
            thumbnail, 
            code,
            stock,
        }
            this.#products.push(producto);
        
        }else{ 

            throw new Error (this.#error)
        }
}

#getNextId(){
    let ultimaposicion = 1;
    if(this.#products.length === 0){
        return ultimaposicion;
    }
    ultimaposicion = this.#products.at(-1).id + 1; //Esto es por si me eliminan valores del medio
    return ultimaposicion;
}

getProductById(idProduct){

    return this.#products.find((product) => product.id === idProduct) ?? 'Not Found';   
    
}

#validateProductEntries = (title, description, price, thumbnail, code, stock) => {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
        this.#error = `[${code}]: campos incompletos`
    } else {
        const found = this.#products.find(producto => producto.code === code)
        if (found) this.#error = `[${code}]: el identificador del producto ya existe`
        else this.#error = undefined
    }
}

    DeleteProduct(idProduct){
        let valor = this.#products.findIndex(idProduct)
        if (valor == -1){ 
            
                this.#products.push(producto);
            
            }else{ 

                throw new Error (this.#error)
            }
    }
}

const productManager = new ProductManager();
productManager.getProducts();
productManager.addProduct('producto prueba','Este es un producto de prueba',200,'Sin imagen','abc123',25);
let prods = productManager.getProducts();
console.log(prods);
let Encontrarproducto = productManager.getProductById(1);  
console.log(Encontrarproducto);
productManager.addProduct('product','This is a sample product',500,'.\imgprod.jpg','abc1234',1);
Encontrarproducto = productManager.getProductById(2);
prods = productManager.getProducts();
console.log(prods);



