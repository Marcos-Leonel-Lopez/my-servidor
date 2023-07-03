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
    resolveTicket = async (tid, action)=>{
        return await ticketPersistence.resolveTicket(tid, action);
    }

    date = async () =>{
        return await ticketPersistence.date();
    }

    idFronFront = async (id)=>{
        console.log(id);
        return
    }// ver como ahcerlo funcional
}