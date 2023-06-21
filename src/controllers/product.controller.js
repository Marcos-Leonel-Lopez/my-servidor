import AccessManager from "../Dao/managers/AccessManager.js";
import productModel from "../Dao/models/product.model.js";
import ProductService from "../services/product.service.js";

const accessManager = new AccessManager();
const productService = new ProductService();

export default class ProductController {
    root = (req,res)=>{
        return res.redirect('/login');
    }
    registerProduct = (req, res) => {
        res.render('registerProduct' , { title:'Registro de productos',style: 'style.css'});
    }
    getProductsPage = async (req, res) => {
        const { limit = 10, page = 1, category = 'all', stock = 'all', sort = 'none' } = req.query;
        let userRole = false;
        const result = await productService.getProductsPage(limit, page, category, stock, sort);
        const userName = req.session.user?.name ? req.session.user.name : req.session.user?.first_name;
        if (req.session.user?.role == 'admin') {
            userRole = true;
        }
        const { status, smg } = result;
        if (status == 200) {
            const { payload, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink } = smg;
            await accessManager.createRecords("Consulta los productos");
            const products = payload.map(item => item.toObject())
            return res.render('home', { products, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink, totalPages, limit, page, category, stock, sort, userName, userRole, title: 'Productos', style: 'style.css', error: false })
        } else {
            await accessManager.createRecords("Get fallido - limit menor a 0");
            return res.render('home', { title: 'Productos', style: 'style.css', error: true })
        }
    }

    getProducts = async (req, res) => {
        const { limit } = req.query;
        const products = await productService.getProducts(limit);
        const { status, smg } = products;
        return res.status(status).send(smg);
    }

    getProductsRealTime = async (req, res) => {
        const products = await productService.getProducts();
        return products.smg.payload
    }

    realtimeproducts = async (req,res) => {
        return res.render('realTimeProducts', { title:'Productos en tiempo real', style: 'style.css', error: false })
    }

    chat = (req, res)=>{
        return res.render('chat',{ title:'Chat', style: 'style.css', error: false })
    }

 




    getProductById = async (id) => {
        const payload = await productModel.find({ _id: id });
        if (payload.length > 0) {
            await accessManager.createRecords(`Consulta el producto id: ${id}`);
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload
                }
            }
        }
        await accessManager.createRecords(`Get fallido - id inexistente`);
        return {
            status: 400,
            smg: {
                status: "error",
                error: `El producto con id:${id} no existe`
            }
        }
    }

    deleteProduct = async (id) => {
        const payload = await productModel.deleteOne({ _id: id });
        if (payload.deletedCount == 1) {
            await accessManager.createRecords(`Elimina el producto id: ${id}`);
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload,
                }
            }
        }
        await accessManager.createRecords(`Delete fallido - id inexistente`);
        return {
            status: 400,
            smg: {
                status: "error",
                error: `El producto con id:${id} no existe`
            }
        }
    }

    addProduct = async (newProduct) => {
        const { code } = newProduct;
        const data = await this.correctData(newProduct);
        if (data != "success") {
            await accessManager.createRecords(`Post fallido - falta: ${data.join(", ")}`);
            return {
                status: 400,
                smg: {
                    status: "error",
                    error: `falta: ${data.join(", ")}`,
                }
            }
        }
        const repeat = await this.codeRepeat(code);
        if (repeat) {
            await accessManager.createRecords(`Post fallido - codigo se repite`);
            return {
                status: 400,
                smg: repeat
            }
        }
        await accessManager.createRecords(`Post correcto - se agrego ${newProduct.title}`);
        const payload = await productModel.create(newProduct);
        return {
            status: 200,
            smg: {
                status: "success",
                payload,
            }
        }
    }

    updateProduct = async (id, newData) => {
        let editValues = await this.conditionData(newData); //acondiciona datos, elimina vacios y undefined
        if (editValues.code) {
            const repeat = await this.codeRepeat(editValues.code);
            if (repeat) {
                await accessManager.createRecords(`Put fallido codigo se repite`);
                return {
                    status: 400,
                    smg: repeat
                }
            }
        }// detecta si el codigo se repite
        const consulta = await productModel.find({ _id: id });
        if (consulta.length > 0) {
            await accessManager.createRecords(`Modifica el producto id: ${id}`);
            const payload = await productModel.updateOne({ _id: id }, { $set: editValues });
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload
                }
            }
        }
        else {
            await accessManager.createRecords(`Put fallido id inexistente`);
            return {
                status: 400,
                smg: {
                    status: "error",
                    error: `El producto con id:${id} no existe`,
                }
            }
        }
    }


    codeRepeat = async (code) => {
        let result = await productModel.find({ code: code });
        if (result.length > 0) {
            return {
                status: "error",
                error: "El codigo se repite",
            };
        }
        return false;
    };

    correctData = async (product) => {
        let mData = [];
        let obj = Object.entries(product);
        obj.forEach((el) => {
            if (el[1] == "") {
                if (el[0] != 'thumbnail') {
                    mData.push(el[0]); // cambio para evitar que valide el campo thumbnail
                }
            }
        });
        if (mData.length > 0) {
            return mData
        }
        return 'success'
    }

    conditionData = async (newData) => {
        let editValues = {};
        for (let [key, value] of Object.entries(newData)) {
            value = value === "" ? undefined : value;
            if (value !== undefined) {
                editValues[key] = value;
            }
        };
        return editValues;
    }

    updateStock = async (productId, quantity) => {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                return {
                    status: 400,
                    smg: {
                        status: "error",
                        error: `El producto con id:${productId} no existe`,
                    },
                };
            }
            const updatedStock = product.stock - quantity;
            if (updatedStock < 0) {
                return {
                    status: 400,
                    smg: {
                        status: "error",
                        error: `No hay suficiente stock disponible para agregar ${quantity} productos`,
                    },
                };
            }

            product.stock = updatedStock;
            product.status = updatedStock > 0;

            await product.save();

            return {
                status: 200,
                smg: {
                    status: "success",
                    message: `Se actualizó el stock del producto con id:${productId}`,
                },
            };
        } catch (error) {
            return {
                status: 500,
                smg: {
                    status: "error",
                    error: error.message,
                },
            };
        }
    };



}