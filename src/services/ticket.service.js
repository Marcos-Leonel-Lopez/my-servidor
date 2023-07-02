import { ticketPersistence } from "../Dao/factory.js";

export default class TicketService{
    getTickets = async ()=>{
        return await ticketPersistence.getTickets();
    }
    getTicketsById = async (id)=>{
        return await ticketPersistence.getTicketsById(id);
    }
    createTicket = async (ticket)=>{
        return await ticketPersistence.createTicket(ticket);
    }
    updateTicket = async (id, ticket)=>{
        return await ticketPersistence.updateTicket(id, ticket);
    }

    daleteTicket = async (id) =>{
        return await ticketPersistence.daleteTicket(id);
    }

    date = async () =>{
        return await ticketPersistence.date();
    }
}