
const {promises: fs, readFile,writeFile} = require ('fs');

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
#path;

 constructor(){
     this.#products = [];
     this.#error=undefined;
     this.#path = './file/products.json'
 }
getProducts = async() =>{
 let val = await this.#readfilecontent(this.#path)
 return val;
}

getProductById = async(id) => {
    let contenido = await this.getProducts()
    const product = contenido.find(producto => producto.id === id);
    console.log(product)
    if (product) return 'Not Found'
    return product
}

addProduct = async(title,description,price,thumbnail,code,stock) =>{
    this.#products = await this.getProducts()
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
            let result = this.#writefilecontent().then(val => console.logval)
            return result

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

getProductById = async (idProduct) => {
    let prods = await this.getProducts() 
    return prods.find((product) => product.id === idProduct) ?? 'Not Found';   
    
}

#readfilecontent = async (path) => {
    try{
        const contenido = await fs.readFile(path,'utf-8')
        //JSON.parse(contenido)
        return JSON.parse(contenido)
    }catch (error){

        return [] //No es necesario lanzar error, simplemente se retorna vacio
    }
}

#writefilecontent = async () => {
    try{
        fs.writeFile(this.#path, JSON.stringify(this.#products,null,'\t'),'utf-8' );
        return 'Producto aniadido'
    }catch (error){

        this.#error = 'Ocurrio un error al escribir el archivo'
        return this.#error
    }
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

deleteProduct = async (id)=>{
    let content = await this.getProducts()
    let cont_nodelete = content.filter(producto => producto.id != id)
    //console.log('No deletees esto:',cont_nodelete)
    await fs.writeFile(this.#path, JSON.stringify(cont_nodelete, null,'\t'),'utf-8')
}

updateProduct = async (id,title, description, price, thumbnail,code,stock)=>{
    let contenido = await this.getProducts()
    let map_cont = contenido.map(producto => producto.id)
    let indx = map_cont.indexOf(id)
    if(indx===-1){
        console.log('No existe tal producto');
    }else{
        let prod = {
            'id': id,
            'title': title,
            'description': description,
            'price': price,
            'thumbnail': thumbnail,
            'code': code,
            'stock': stock
        }
        contenido.splice(indx,1,prod)
        await fs.writeFile(this.#path, JSON.stringify(contenido, null,'\t'))
    }
    


};
}



module.exports = {ProductManager};

const productManager = new ProductManager();
async function main() {
    const products = await productManager.getProducts();
    console.log(products);
    let prodbyid = await productManager.getProductById(2)
    console.log('Prod by id: ',prodbyid);
    //productManager.addProduct('product','This is a sample product',200,'.\imgprod.jpg','abc1234',1);
    let delprod = await productManager.deleteProduct(2)
    console.log(delprod);
    //await productManager.updateProduct(2,'product','This is a sample product',300,'.\imgprod.jpg','abc1234',1);
  }

main();



