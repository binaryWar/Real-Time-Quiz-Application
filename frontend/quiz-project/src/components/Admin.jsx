import { useEffect, useState } from 'react';
import socketIO from 'socket.io-client';
import { CreateProblem } from './CreateProblem';
import { QuizControls } from './QuizControls';

const Admin = () => {
    const [roomId, setRoomId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [quiz,setQuiz] = useState(null);
    useEffect(() => {
        const socket = socketIO.connect('http://localhost:3000');
        setSocket(socket);
        socket.on("connect", () => {
            socket.emit("joinAdmin", {
                password: "ADMIN_PASSWORD",
                name : "admin"
            })
        });
    }, []);
    if(!quiz){
        return (
            <div className='m-auto text-center mt-5 w-64'>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room Id </label>
                <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="12345565" required 
                  onChange={(e) => {
                    setRoomId(e.target.value)
                }} />
                <br />
                <button type="button" className="outline-1 text-white border-white border p-2" onClick={() => {
                    socket.emit("createQuiz",{
                        roomId
                    });
                    setQuiz(roomId)
                }}>Create Room</button>
            </div>
        )
    }
    return <div>
            <CreateProblem socket={socket} roomId={roomId}/>
            <QuizControls socket={socket} roomId={roomId}/>
        </div> 
}
export default Admin;