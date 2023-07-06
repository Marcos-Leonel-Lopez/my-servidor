import { productPersistence, sessionPersistence, cartPersistence, ticketPersistence } from "../Dao/factory.js";
import { ProductRepository } from "./product.repository.js";
import { CartRepository } from "./cart.repository.js";
import { SessionRepository } from "./session.repository.js";
import { TicketRepository } from "./ticket.repository.js";

export const productService = new ProductRepository(productPersistence)
export const cartService = new CartRepository(cartPersistence)
export const sessionService = new SessionRepository(sessionPersistence);
export const ticketService = new TicketRepository(ticketPersistence);