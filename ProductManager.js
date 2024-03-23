const {promises: fs, readFile,writeFile} = require ('fs');

const prodObj = {
    title: this.title,
    description: this.description,
    price: this.price,
    thumbnail: this.thumbnail,
    code: this.code,
    stock: this.stock
}

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


let mapeoPropiedades = {};

/**
 * @type {Boolean} Funciona como auxiliar para parsear properties ingresadas como array (desde parametros) al instanciar la clase ProductManager, de tal modo que si se agregan mas properties simplemente se haga desde el objeto
 */
function mapearPropiedades(objeto1, objeto2) {
    let acum = 0
    for (const [key] of Object.entries(objeto1)) {
        mapeoPropiedades = Object.assign({[acum]:key},mapeoPropiedades)   
        acum++
    }
    for (const propiedad in objeto2) {
        if (mapeoPropiedades.hasOwnProperty(propiedad)) {
        const nuevaPropiedad = mapeoPropiedades[propiedad];
        objeto1[nuevaPropiedad] = objeto2[propiedad];
        
    }else{
        return false
        }
    
        
    
    } return true
} 


class ProductManager{

 /**
     * @type {Array<Product>}
     */

 #products;
 /**
 * @type {string}
 */
#error;
#path

/**
 * @type {Product}
 */


constructor(){
    this.#products = [];
    this.#error=undefined;
    this.#path = './file/products.json' 
}
    
    #readfilecontent = async () => {
        try{
            const contenido = await fs.readFile(this.#path,'utf-8')
            return JSON.parse(contenido)

        }catch (error){

            return [] //No es necesario lanzar error, simplemente se retorna vacio
        }
    }

    #writefilecontent = async (...producto) => {
        try{
            fs.writeFile(this.#path, JSON.stringify(producto,null,'\t'),'utf-8' );
            return 'Producto aniadido'
        }catch (error){

            this.#error = 'Ocurrio un error al escribir el archivo'
            return this.#error
        }
    }
    getProducts = async () => {
        this.#products = await this.#readfilecontent()
        if(this.#products.length === 0){
            return 'No existe lista de productos'
        }
        return this.#products
    }



    /**
     * 
     * @param {Product} product 
     */
    addProduct(...receivedprod){
        if(mapearPropiedades(prodObj, receivedprod)){
        let valor = this.#validateProductEntries(prodObj)
         if (this.#error === undefined){ 
            const producto = {id: this.#getNextId(),...prodObj};
            this.#products.push(producto);
            console.log(producto)
            this.#writefilecontent(this.#products).then(result => console.log(`${result}`))
            }else{ 
                throw new Error (this.#error)
         }
    } else{
        let e = 'La cantidad de argumentos ingresados es incorrecta'
        return (console.log(e))
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

/**
 * 
 * @param {Product} product 
 */
#validateProductEntries = () => {

    //const {title, description, price, thumbnail, code, stock} = product
    for (const [key, value] of Object.entries(prodObj)) {
        if (!value) {
            this.#error = `[${prodObj.code}]: El campo ${key} esta vacio`
        }
      }
    let found = this.#products.find(producto => producto.code === prodObj.code)
    console.log('Found: ',found)
    if (found) this.#error = `[${code}]: el identificador del producto ya existe`
    else this.#error = undefined
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

const pmg = new ProductManager();
pmg.getProducts().then(val => console.log(`1. El producto es: ${val}`));

pmg.addProduct('producto prueba','Este es un producto de prueba',200,'Sin imagen','abc123',25);
pmg.getProducts().then(val => console.log(`2. El producto es: ${val}`));
/*let prods = productManager.getProducts();
console.log(prods);
let Encontrarproducto = productManager.getProductById(1);  
console.log(Encontrarproducto);
productManager.addProduct('product','This is a sample product',500,'.\imgprod.jpg','abc1234',1);
Encontrarproducto = productManager.getProductById(2);
prods = productManager.getProducts();
console.log(prods);*/



