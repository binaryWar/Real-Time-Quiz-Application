import { IoManager } from "./managers/IoManager";
import { UserManager } from "./managers/UserManager";

const io = IoManager.getIO();
const userManager = new UserManager();

io.on('connection', (socket:any) => {
  console.log("user added with user id ",socket.id);
  userManager.addUser(socket);
});
io.listen(3000);