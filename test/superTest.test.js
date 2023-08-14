import chai from "chai";
import supertest from "supertest";
import productModel from "../src/Dao/models/product.model.js";
import userModel from "../src/Dao/models/user.model.js";
import cartModel from "../src/Dao/models/cart.model.js";
import {app} from "../src/app.js"
import { beforeEach } from "mocha";

const expect= chai.expect;
// const requester = supertest('http://localhost:8080');
const requester = supertest(app); // evita utilizar 2 terminales

describe('Testing e-commerce',()=>{

    describe('Test de las rutas',()=>{
    
        let loginResponse;
        const email = "juan@mail.com";
        after(async()=>{
            process.exit();
        })
        beforeEach(function(){
            this.timeout(5000)
        })

        it('Se intentara loguearse con credenciales incorrectas', async ()=>{
            const response  = await requester.post("/api/sessions/login").send({mail: email,password: '123qwe123'})
            expect(response.statusCode).to.be.equal(302);
        })

        it('Se intentara loguearse con credenciales correctas', async function(){
            const userMock = {
                mail: email,
                password: '123qwe'
            }
            loginResponse  = await requester.post("/api/sessions/login").send(userMock)
            expect(loginResponse.statusCode).to.be.ok;
        })

        it('Se intentara crear un producto y por defecto se le atribuye el valor "true" a la key "status"',async ()=>{
            const sessioCookie = loginResponse.header['set-cookie']
            const productMock = {
                title: "Jalapeños en yogurt",
                description: "Jalapeños fritos sobre una base de yogurt griego",
                price: 2100,
                thumbnail: "http://.....",
                code: "JPY",
                stock: 45,
                category: "Entrada"
            }
            const {_body,statusCode} = await requester.post("/api/products").set("Cookie",sessioCookie).send(productMock);
            expect(statusCode).to.be.equal(200);
            expect(_body.payload.status).to.be.equal(true);
        })

        it('Se intentara crear un producto con el mismo codigo del producto anterior y este deberia responder de forma negativa',async ()=>{
            const sessioCookie = loginResponse.header['set-cookie']
            const productMock = {
                title: "Ravioles de acelga",
                description: "Ravioles de acelga con salsa a eleccion",
                price: 2100,
                thumbnail: "http://.....",
                code: "JPY",
                stock: 30,
                category: "Principal"
            }
            const {statusCode} = await requester.post("/api/products").set("Cookie",sessioCookie).send(productMock);
            expect(statusCode).to.be.equal(400);
        })



        it('No se deberia poder agregar al carrito el producto que creo este usuario', async ()=>{
            const code = "JPY";
            const sessioCookie = loginResponse.header['set-cookie']
            const product = await productModel.findOne({code:code});
            const user = await userModel.findOne({mail:email})
            const response  = await requester.post(`/api/carts/${user.cart}/product/${product._id}`).set("Cookie",sessioCookie);
            const {_body,statusCode} = response
            expect(statusCode).to.be.equal(400);
            expect(_body.status).to.be.equal("error");
        })

        it('Se deberia agregar un producto correspondiente a otro usuario al carrito', async ()=>{
            const sessioCookie = loginResponse.header['set-cookie']
            const pid = "6462a7aec0197e8a1165e47c"
            const user = await userModel.findOne({mail:email})
            const response  = await requester.post(`/api/carts/${user.cart}/product/${pid}`).set("Cookie",sessioCookie);
            const {statusCode} = response
            expect(statusCode).to.be.equal(200);
        })

        it('Se obtiene un carrito en especifico', async ()=>{
            const sessioCookie = loginResponse.header['set-cookie']
            const user = await userModel.findOne({mail:email})
            const response  = await requester.get(`/api/carts/${user.cart}`).set("Cookie",sessioCookie);
            const {_body} = response
            expect(_body.cart).to.be.an("object")
            expect(_body.cart.products).to.be.an("array").that.is.not.empty;
        })

        it('Se eliminan los productos que contiene el carrito', async()=>{
            const sessioCookie = loginResponse.header['set-cookie']
            const user = await userModel.findOne({mail:email})
            const response  = await requester.delete(`/api/carts/${user.cart}`).set("Cookie",sessioCookie);
            const {statusCode,_body} = response
            expect(statusCode).to.be.equal(200);
            expect(_body.result.products).to.be.an("array").that.is.empty;
        })

        it('Se intentara eliminar producto creado anteriormente', async ()=>{
            const code = "JPY";
            const sessioCookie = loginResponse.header['set-cookie']
            const product = await productModel.findOne({code:code});
            const response  = await requester.delete(`/api/products/${product.id}`).set("Cookie",sessioCookie);
            const {_body,statusCode} = response
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("success");
        })

        it('Se intentara desloguear', async ()=>{
            const sessioCookie = loginResponse.header['set-cookie']
            const response  =  await requester.get("/api/sessions/logout").set("Cookie",sessioCookie)
            const {statusCode} = response
            expect(statusCode).to.be.equal(302);
        })

    })
})