import { ticketService } from "../repository/index.repository.js";

export default class TicketController {
    getTickets = async (req, res) => {
        try {
            const { status, message } = await ticketService.getTickets();
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }
    getTicketsById = async (req, res) => {
        try {
            const tid = req.params.tid;
            const { status, message } = await ticketService.getTicketsById(tid);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }

    createTicket = async (req, res) => {
        try {
            const newTicket = req.body;
            newTicket.code = uuidv4();
            newTicket.purchase_datatime = await ticketService.date();
            const { status, message } = await ticketService.createTicket(newTicket);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }

    updateTicket = async (req, res) => {
        try {
            const tid = req.params.tid;
            const newData = req.body;
            const { status, message } = await ticketService.updateTicket(tid, newData);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    } // no tiene funcionalidad aun

    daleteTicket = async (req, res) => {
        try {
            const tid = req.params.tid;
            const { status, message } = await ticketService.daleteTicket(tid);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    }

    resolveTicket = async (req, res) => {
        try {
            const tid = req.params.tid;
            const action = req.body;
            const { status, message } = await ticketService.resolveTicket(tid, action);
            res.status(status).send(message);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }

    }

    takeIDFront = async (req, res) => {
        try {

        } catch (error) {

        }
    }




}