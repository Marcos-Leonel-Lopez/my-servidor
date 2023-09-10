import ticketModel from "../../models/ticket.model.js";
import { sendTiketCompleted } from "../../../config/gmail.js";
import { v4 as uuidv4 } from 'uuid';
import { date } from "../../../utils.js";


export class TicketMongo {
    getTickets = async () => {
        try {
            const tickets = await ticketModel.find();
            return {
                status: 200,
                message: {
                    status: "success",
                    tickets
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            };
        }
    }

    getTicketsById = async (id) => {
        try {
            const ticket = await ticketModel.findById(id) //.populate('products.productId');
            if (!ticket) {
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `El ticket con id:${id} no existe`
                    }
                };
            }
            return {
                status: 200,
                message: {
                    status: "success",
                    ticket
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            };
        }
    };

    createTicket = async (ticket) => {
        try {
            ticket.code = uuidv4();
            const data = await this.correctData(ticket);
            if (data != "success") {
                return {
                    status: 400,
                    message: {
                        status: "error",
                        error: `falta: ${data.join(", ")}`,
                    }
                }
            }
            const { code } = ticket;
            const repeat = await this.codeRepeat(code);
            if (repeat) {
                return {
                    status: 400,
                    message: repeat
                }
            }
            const newTicket = await ticketModel.create(ticket);
            return {
                status: 200,
                message: {
                    status: "success",
                    newTicket
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error al crear ticket",
                    error: error.message
                }
            };
        }
    }

    updateTicket = async (id, ticket) => {
        try {
            const ticketUpdate = await ticketModel.findByIdAndUpdate(id, order, { new: true })
            return {
                status: 200,
                message: {
                    status: "success",
                    ticketUpdate
                }
            };
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            };
        }
    }

    correctData = async (ticket) => {
        let mData = [];
        let obj = Object.entries(ticket);
        obj.forEach((el) => {
            if (el[1] == "") {
                mData.push(el[0]);
            }
        });
        if (mData.length > 0) {
            return mData
        }
        return 'success'
    }

    codeRepeat = async (code) => {
        let result = await ticketModel.find({ code: code });
        if (result.length > 0) {
            return {
                status: "error",
                error: "El codigo se repite",
            };
        }
        return false
    };

    daleteTicket = async (id) => {
        try {
            const data = await ticketModel.deleteOne({ _id: id });
            if (data.deletedCount == 1) {
                return {
                    status: 200,
                    message: {
                        status: "success",
                        data
                    }
                }
            }
            return {
                status: 400,
                message: {
                    status: "error",
                    error: `El ticket con id:${id} no existe`
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error",
                    error: error.message
                }
            };
        }

    }

    resolveTicket = async (tid, action) => {
        try {
            const ticket = await this.getTicketsById(tid);
            ticket.message.ticket.status = action.action
            const result = ticket.message.ticket
            if (action.action == 'completed') {
                //await sendTiketCompleted(result) // se deberia enviar con un email valido y no de prueba
                console.log('el ticket paso a estar resuelto');    
            }
            return {
                status: 200,
                message: {
                    status: "success",
                    result
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: {
                    status: "error al resolver ticket",
                    error: error.message
                }
            };
        }
    }

}


interface de compra terminado