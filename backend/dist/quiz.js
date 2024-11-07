"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const IoManager_1 = require("./managers/IoManager");
const some_value = 20;
class Quiz {
    constructor(roomId) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeIndex = 0;
        this.users = [];
        this.currentState = "not_started";
    }
    addProblem(problem) {
        this.problems.push(problem);
        console.log(this.problems);
    }
    start() {
        this.hasStarted = true;
        this.currentState = "question";
        const io = IoManager_1.IoManager.getIO();
        io.emit("CHANGE_PROBLEM", {
            state: this.getCurrentState(),
        });
        // this.problems[0].startTime = new Date().getTime();
        this.setActiveProblem(this.problems[0]);
    }
    next() {
        this.activeIndex++;
        const problem = this.problems[this.activeIndex];
        const io = IoManager_1.IoManager.getIO();
        if (problem) {
            this.currentState = "question";
            // problem.startTime = new Date().getTime();
            this.setActiveProblem(problem);
            io.emit("CHANGE_PROBLEM", {
                state: this.getCurrentState(),
            });
        }
        else {
            this.currentState = "ended";
            // show final results here 
            io.emit("CHANGE_PROBLEM", {
                state: this.getCurrentState(),
            });
        }
    }
    generateRandomId(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    addUser(roomId, name) {
        console.log("user added in quiz " + name);
        const id = this.generateRandomId(10);
        this.users.push({
            id, name,
            points: 0
        });
        return id;
    }
    submit(userId, roomId, problemId, submission) {
        const problem = this.problems.find(x => x.id === problemId);
        const user = this.users.find(x => x.id === userId);
        if (!problem || !user)
            return;
        const existingSubmission = problem.submission.find(ans => ans.userId === userId);
        if (existingSubmission)
            return;
        problem.submission.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected: submission
        });
        console.log("problem " + JSON.stringify(problem));
        user.points += 500 - (new Date().getTime() - problem.startTime) / some_value;
    }
    getLeaderBoard() {
        console.log(JSON.stringify(this.users) + "users list ");
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1);
    }
    sendLeaderBoard() {
        this.currentState = "leaderboard";
        const leaderBoard = this.getLeaderBoard();
        IoManager_1.IoManager.getIO().emit("LEADERBOARD_EVENT", {
            state: this.getCurrentState()
        });
        console.log("emitted new value leaderboard" + JSON.stringify(leaderBoard));
    }
    // that i do not understand the timeout part
    setActiveProblem(problem) {
        problem.startTime = new Date().getTime();
        problem.submission = [];
        setTimeout(() => {
            this.sendLeaderBoard();
            console.log("send event triggred point");
        }, 5000);
    }
    getCurrentState() {
        console.log("currrent state " + this.currentState);
        if (this.currentState === "not_started") {
            return {
                type: "not_started"
            };
        }
        if (this.currentState === "ended") {
            return {
                type: "ended"
            };
        }
        if (this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderBoard()
            };
        }
        if (this.currentState === "question") {
            return {
                type: "question",
                problem: this.problems[this.activeIndex]
            };
        }
    }
}
exports.Quiz = Quiz;
