import productModel from "../Dao/models/product.model.js";
import AccessManager from "../Dao/managers/AccessManager.js";

const accessManager = new AccessManager();

export default class ProductDao{

    getProductsPage = async (limit, page, category, stock, sort) => {
        if (limit <= 0) {
            await accessManager.createRecords("Get fallido - limit menor a 0");
            return {
                status: 400,
                smg: {
                    status: "error",
                    error: `Limite debe ser mayor a 0(cero)`
                }
            };
        }
        await accessManager.createRecords(`Consulta los productos`);
        let filter = {};
        let sortOrder = sort === '-1' ? -1 : 1;
        let sortOption = {};
        if (category !== 'all') {
            filter.category = category;
            sortOption.price = sortOrder;
        }
        if (stock !== 'all') {
            filter.status = stock;
            sortOption.price = sortOrder;
        }
        if (sort !== 'none') {
            sortOption.price = sortOrder;
        }
        const data = await productModel.paginate(filter, { limit, page, sort: sortOption });
        const prevLink = data.hasPrevPage ? `/products?page=${data.prevPage}&limit=${limit}&category=${category}&stock=${stock}&sort=${sort}` : null;
        const nextLink = data.hasNextPage ? `/products?page=${data.nextPage}&limit=${limit}&category=${category}&stock=${stock}&sort=${sort}` : null;
        return {
            status: 200,
            smg: {
                status: "success",
                payload: data.docs,
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevLink,
                nextLink
            }
        };
    };

    getProducts = async (limit) => {
        if (limit) {
            if (limit > 0) {
                await accessManager.createRecords(`Consulta los productos los primeros ${limit} productos`);
                const payload = await productModel.find().limit(limit)
                return {
                    status: 200,
                    smg: {
                        status: "success",
                        payload
                    }
                }
            }
            await accessManager.createRecords("Get fallido - limit menor a 0");
            return {
                status: 400,
                smg: {
                    status: "error",
                    error: `Limite debe ser mayor a 0(cero)`
                }
            }
        } else {
            await accessManager.createRecords("Consulta los productos");
            const payload = await productModel.find();
            return {
                status: 200,
                smg: {
                    status: "success",
                    payload
                }
            }
        }
    };
}