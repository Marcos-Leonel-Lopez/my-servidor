export class TicketRepository{
    constructor(dao){
        this.dao = dao;
    }
    getTickets = async ()=>{
        return await this.dao.getTickets();
    }
    getTicketsById = async (id)=>{
        return await this.dao.getTicketsById(id);
    }
    createTicket = async (ticket)=>{
        return await this.dao.createTicket(ticket);
    }
    updateTicket = async (id, ticket)=>{
        return await this.dao.updateTicket(id, ticket);
    }
    daleteTicket = async (id) =>{
        return await this.dao.daleteTicket(id);
    }
    resolveTicket = async (tid, action)=>{
        return await this.dao.resolveTicket(tid, action);
    }
    date = async () =>{
        return await this.dao.date();
    }
    idFronFront = async (id)=>{
        console.log(id);
        return
    }// ver como ahcerlo funcional
}