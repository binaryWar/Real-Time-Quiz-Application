import { Socket } from "socket.io"
import { quizManager } from "./quizManager";
const ADMIN_PASSWORD = "ADMIN_PASSWORD";

export class UserManager{
    private users : {
        roomId:string,
        socket : Socket
    }[];
    private quizManager : quizManager;
    constructor(){
        this.users = [];
        this.quizManager = new quizManager();
    }
    addUser(socket:Socket){
        this.createHandlers(socket);
    }
    private createHandlers(socket:Socket){
        socket.on("join",(data:any)=>{
            const userId = this.quizManager.addUser(data.roomId,data.name);
            socket.emit("init",{
                userId,
                state : this.quizManager.getCurrentState(data.roomId)
            })
        })
        socket.on("joinAdmin",(data:any)=>{

            if(data.password!== ADMIN_PASSWORD) return ;
            console.log("============= admin JOINED ========= ", data.password);
            socket.emit("adminInit",{
                state : this.quizManager.getCurrentState(data.roomId)
            })
            socket.on("createproblem",(problemData:any)=>{
                const roomId =  problemData.roomId;
                this.quizManager.addProblem(roomId, problemData.problem);
            })
            socket.on("createQuiz",data=>{
                const roomId =  data.roomId;
                this.quizManager.addQuiz(roomId);
            })
            socket.on("next",(data:any)=>{
                console.log("next event trigrred ===========>" +  data.roomId)
                this.quizManager.next(data.roomId);
            })
            socket.on("start_quiz",(data:any)=>{
                console.log("quiz started with room id ", data.roomId);
                this.quizManager.start(data.roomId)
            })
        })
        socket.on("submit",(data)=>{
            const userId = data.userId;
            const problemId = data.problemId;
            const submission  = data.submission;
            const roomId = data.roomId;
            if(![0,1,2,3].includes(submission)){
                console.error("Invalid option selected " + submission);
                return;
            } 
            // userId:string,roomId:string,problemId:string,submission : AllowedSubmission
            this.quizManager.submit(userId,roomId,problemId,submission)
        })
    }
}