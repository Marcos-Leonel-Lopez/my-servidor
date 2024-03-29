import AccessManager from "../Dao/managers/AccessManager.js";
import { productService } from "../repository/index.repository.js";
import { UserDto } from "../Dao/dto/user.dto.js";
import { CustomError } from "../services/customError.service.js";
import { generateProductErrorParam } from "../services/productError/productErrorParam.js";
import { generateProductErrorInfo } from "../services/productError/productErrorInfo.js";
import { EError } from "../enums/EError.js";
import { addLogger } from "../utils/logger.js";
import { updateOwner, updateLC } from "../scripts/script.js";



const accessManager = new AccessManager();




export default class ProductController {
    root = async (req, res) => {
        return res.redirect('/login');
    }
    script = async (req, res) => {
        //await updateOwner(); a todos los productos como el owner, le impone el id del "juan perez"
        await updateLC(); //actualiza el ultimo logueo de todos los usuarios a la hora actual
        req.logger.info('actualizado')
        return res.redirect('/products');
    }
    registerProduct = (req, res) => {
        res.render('registerProduct', { title: 'Registro de productos', style: 'style.css' });
    }
    getProductsPage = async (req, res) => {
        const { limit = 10, page = 1, category = 'all', stock = 'all', sort = 'none' } = req.query;
        const result = await productService.getProductsPage(limit, page, category, stock, sort);
        let admin = false;
        let canEdit = false;
        let userRole = null;
        let userCart = null;
        let userName = null;
        const persona = req.session.user;
        if (persona) {
            const usuarioDto = new UserDto(persona);
            userName = usuarioDto.name;
            userRole = usuarioDto.role;
            userCart = usuarioDto.cart;
        }
        req.logger.debug(userRole + ' despues del dto');
        if (userRole === 'admin') admin = true;
        if (userRole === 'premium') canEdit = true;
        const { status, message } = result;
        if (status == 200) {
            const { payload, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink } = message;
            await accessManager.createRecords("Consulta los productos");
            const products = payload.map(item => {
                const productObject = item.toObject();
                productObject.userCart = userCart;
                return productObject;
            })
            return res.render('home', { products, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink, totalPages, limit, page, category, stock, sort, userName, admin, userCart, canEdit, title: 'Productos', style: 'style.css', error: false })
        } else {
            await accessManager.createRecords("Get fallido - limit menor a 0");
            return res.render('home', { title: 'Productos', style: 'style.css', error: true })
        }
    }
    getProducts = async (req, res, next) => {
        try {
            const { limit } = req.query;
            const products = await productService.getProducts(limit);
            const { status, message } = products;
            if (status === 400) {
                req.logger.fatal("error fatal al obtener productos!");
                CustomError.createError({
                    name: "Limit error",
                    cause: generateProductErrorParam(limit),
                    message: "Error al obtener productos",
                    errorCode: EError.INVALID_PARAMS
                })
            }
            return res.status(status).send(message);
        } catch (error) {
            next(error)
        }
    }
    getProductsRealTime = async (req, res) => {
        const products = await productService.getProducts();
        return products.message.payload
    }
    realtimeproducts = async (req, res) => {
        return res.render('realTimeProducts', { title: 'Productos en tiempo real', style: 'style.css', error: false })
    }
    chat = (req, res) => {
        return res.render('chat', { title: 'Chat', style: 'style.css', error: false })
    }
    getProductById = async (req, res) => {
        const id = req.params.pid;
        const result = await productService.getProductById(id);
        const { status, message } = result;
        return res.status(status).send(message);
    }
    deleteProduct = async (req, res) => {
        try {
            const id = req.params.pid;
            let userEmail = " ";
            const person = req.session.user;
            if (person) {
                const usuarioDto = new UserDto(person);
                userEmail = usuarioDto.mail;
            }
            const result = await productService.deleteProduct(id, userEmail);
            const { status, message } = result;
            return res.status(status).send(message);
        } catch (error) {
            res.status(500).send(error.message);
        }

    }
    addProduct = async (req, res, next) => {
        try {
            req.logger.info('addProduct');
            let ownerEmail = " ";
            const newProduct = req.body;
            const person = req.session.user;
            req.logger.debug(JSON.stringify(req.session.user))
            if (person) {
                const usuarioDto = new UserDto(person);
                ownerEmail = usuarioDto.mail;
            }
            req.logger.info(ownerEmail);
            const { status, message } = await productService.addProduct(newProduct, ownerEmail);
            if (status === 400) {
                const info = message.status === 'error_json' ? 'Faltan datos' : '"code" se repite';
                req.logger.fatal("error fatal al crear producto!");
                CustomError.createError({
                    name: "Error al agregar producto",
                    cause: generateProductErrorInfo(message.error),
                    message: info,
                    errorCode: EError.INVALID_JSON
                })
            }
            return res.status(status).send(message);
        } catch (error) {
            next(error)
        }

    }
    updateProduct = async (req, res) => {
        try {
            const id = req.params.pid;
            const newData = req.body;
            let userEmail = " ";
            const person = req.session.user;
            if (person) {
                const usuarioDto = new UserDto(person);
                userEmail = usuarioDto.mail;
            }
            const { status, message } = await productService.updateProduct(id, newData, userEmail);
            return res.status(status).send(message);
        } catch (error) {
            res.status(500).send(error.message);
        }

    }
    mockingproducts = async (req, res, next) => {
        try {
            let ownerEmail = " ";
            const person = req.session.user;
            if (person) {
                const usuarioDto = new UserDto(person);
                ownerEmail = usuarioDto.mail;
            } else {
                req.logger.info('se hardcodeo')
                ownerEmail = 'marcosleonellopez@gmail.com'
            }
            const cantidad = 3;
            const { status, message } = await productService.mockingproducts(cantidad, ownerEmail)
            res.status(status).send(message);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    updateProductDocuments = async (req, res) => {
        try {
            const code = req.params.code;
            const userEmail = req.session.user.mail;
            const img_1 = req.files['img_1']?.[0] || null;
            const img_2 = req.files['img_2']?.[0] || null;
            const img_3 = req.files['img_3']?.[0] || null;
            const img_4 = req.files['img_4']?.[0] || null;
            const img_5 = req.files['img_5']?.[0] || null;
            const { status, message } = await productService.updateProductDocuments(code, userEmail, img_1, img_2, img_3, img_4, img_5);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }
}

