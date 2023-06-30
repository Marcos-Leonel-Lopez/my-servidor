 export class CreateProductDto{
    constructor(product){
        this.title = product.title;
        this.description = product.description  
        this.price = product.price
        this.thumbnail = product.thumbnail
        this.status = product.status
        this.code = product.code
        this.stock =  product.stock
        this.category = product.category
    }
 }
 export class GetProductDto{
    constructor()
 }