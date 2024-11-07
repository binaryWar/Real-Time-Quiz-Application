"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const quizManager_1 = require("./quizManager");
const ADMIN_PASSWORD = "ADMIN_PASSWORD";
class UserManager {
    constructor() {
        this.users = [];
        this.quizManager = new quizManager_1.quizManager();
    }
    addUser(socket) {
        this.createHandlers(socket);
    }
    createHandlers(socket) {
        socket.on("join", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(data.roomId)
            });
        });
        socket.on("joinAdmin", (data) => {
            if (data.password !== ADMIN_PASSWORD)
                return;
            console.log("============= admin JOINED ========= ", data.password);
            socket.emit("adminInit", {
                state: this.quizManager.getCurrentState(data.roomId)
            });
            socket.on("createproblem", (problemData) => {
                const roomId = problemData.roomId;
                this.quizManager.addProblem(roomId, problemData.problem);
            });
            socket.on("createQuiz", data => {
                const roomId = data.roomId;
                this.quizManager.addQuiz(roomId);
            });
            socket.on("next", (data) => {
                console.log("next event trigrred ===========>" + data.roomId);
                this.quizManager.next(data.roomId);
            });
            socket.on("start_quiz", (data) => {
                console.log("quiz started with room id ", data.roomId);
                this.quizManager.start(data.roomId);
            });
        });
        socket.on("submit", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.roomId;
            if (![0, 1, 2, 3].includes(submission)) {
                console.error("Invalid option selected " + submission);
                return;
            }
            // userId:string,roomId:string,problemId:string,submission : AllowedSubmission
            this.quizManager.submit(userId, roomId, problemId, submission);
        });
    }
}
exports.UserManager = UserManager;
