"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IoManager_1 = require("./managers/IoManager");
const UserManager_1 = require("./managers/UserManager");
const io = IoManager_1.IoManager.getIO();
const userManager = new UserManager_1.UserManager();
io.on('connection', (socket) => {
    console.log("user added with user id ", socket.id);
    userManager.addUser(socket);
});
io.listen(3000);
