import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";

const ticketController = new TicketController();

const router = Router();

router.get('/', ticketController.getTickets)
router.get('/:tid', ticketController.getTicketsById)
router.post('/', ticketController.createTicket)
router.delete('/:tid', ticketController.daleteTicket)

export default router;