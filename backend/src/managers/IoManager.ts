import { Server } from "socket.io";
import http from 'http';
const server = http.createServer();

export class IoManager{
    private static io : Server;
    constructor(){}
    public static getIO(){
        if(!this.io){
            const io = new Server(server,{
                cors : {
                    origin : "*",
                    methods : ["GET","POST"]
                }
            });
            this.io = io;
        }
        return this.io;
    }
}