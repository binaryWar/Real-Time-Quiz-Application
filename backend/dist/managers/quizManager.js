"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizManager = void 0;
const quiz_1 = require("../quiz");
let globalProblemId = 0;
class quizManager {
    constructor() {
        this.quizes = [];
    }
    start(roomId) {
        const quiz = this.getQuiz(roomId);
        quiz === null || quiz === void 0 ? void 0 : quiz.start();
    }
    next(roomId) {
        const quiz = this.getQuiz(roomId);
        quiz === null || quiz === void 0 ? void 0 : quiz.next();
    }
    addUser(roomId, name) {
        var _a;
        return (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.addUser(roomId, name);
    }
    getQuiz(roomId) {
        var _a;
        return (_a = this.quizes.find(x => x.roomId === roomId)) !== null && _a !== void 0 ? _a : null;
    }
    submit(userId, roomId, problemId, submission) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.submit(userId, roomId, problemId, submission);
    }
    getCurrentState(roomId) {
        const quiz = this.quizes.find(x => x.roomId === roomId);
        if (!quiz)
            return null;
        return quiz.getCurrentState();
    }
    addProblem(roomId, problem) {
        const quiz = this.getQuiz(roomId);
        if (!quiz)
            return;
        quiz.addProblem(Object.assign(Object.assign({}, problem), { id: (globalProblemId++).toString(), startTime: new Date().getTime(), submission: [] }));
    }
    addQuiz(roomId) {
        const quiz = new quiz_1.Quiz(roomId);
        this.quizes.push(quiz);
    }
    startQuiz(roomId, socket) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.start();
    }
}
exports.quizManager = quizManager;
