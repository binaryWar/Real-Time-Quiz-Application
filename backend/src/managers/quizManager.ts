import { Socket } from "socket.io";
import { AllowedSubmission, Quiz } from "../quiz";
import { IoManager } from "./IoManager";
let globalProblemId = 0;
export class quizManager{
    private quizes : Quiz[];
    constructor(){
        this.quizes = [];
    }
    public start(roomId:string){
        const quiz = this.getQuiz(roomId);
        quiz?.start();
    }
    public next(roomId:string){
        const quiz = this.getQuiz(roomId);
        quiz?.next();
    }

    addUser(roomId:string,name:string){
        return this.getQuiz(roomId)?.addUser(roomId,name);
    }

    getQuiz(roomId : string){
        return this.quizes.find(x=>x.roomId === roomId) ?? null;
    }
    submit(userId:string,roomId:string,problemId:string,submission : AllowedSubmission){
        this.getQuiz(roomId)?.submit(userId,roomId,problemId,submission);
    }
    getCurrentState(roomId : any) {
        const quiz = this.quizes.find(x=>x.roomId === roomId);
        if(!quiz) return null;
        return quiz.getCurrentState();

    }
    public addProblem(roomId:string, problem : {
        title : string,
        description:string,
        image?:string,
        options : {
            id : number,
            title : string
        }[],
        answer : AllowedSubmission
    }){
        const quiz = this.getQuiz(roomId);
        if(!quiz) return;
        quiz.addProblem({
            ...problem,
            id : (globalProblemId++).toString(),
            startTime : new Date().getTime(),
            submission : []
        });
    }
    addQuiz(roomId:string){
        const quiz = new Quiz(roomId);
        this.quizes.push(quiz);
    }
    public startQuiz(roomId:string,socket:Socket){
        this.getQuiz(roomId)?.start();
    }
}
