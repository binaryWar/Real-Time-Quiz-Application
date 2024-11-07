import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import socketIO from 'socket.io-client';
const User = () => {
    const { roomId } = useParams();
    const [name , setName ] = useState("");
    const [currentState, setCurrentState] = useState("not_started");
    const [userId, setUserId] = useState("");
    const [socket, setSocket] = useState(null);
    const [currentProblem, setCurentProblem] = useState(null);
    const [leaderBoard, setLeaderBoard] = useState([]);
    useEffect(() => {
        const socket = socketIO.connect('http://localhost:3000');
        setSocket(socket)
        socket.on("connect", () => {
           
        });
        socket.on("init",(data)=>{
            setUserId(data.userId);
            setCurrentState(data.state?.type);
            setCurentProblem(data?.state?.problem);
        });
        socket.on("CHANGE_PROBLEM",(data)=>{    
            setCurentProblem(data.state.problem);
            setCurrentState(data.state.type);
        });
        socket.on("LEADERBOARD_EVENT",(data)=>{
            setCurrentState(data?.state?.type);
            setLeaderBoard(data.state?.leaderboard)
        })
    }, []);


    if (!userId) {
        return <div className="w-96 m-auto mt-5 p-2">
            <input type="text" id="text-input" className="p-2" onBlur={(e)=>{
                console.log(e.target.value);
                setName(e.target.value);
            }}/>
            <button type="button" className="text-white text-sm border border-white ml-4 p-2" onClick={
                ()=>{
                    socket.emit("join", {
                        roomId,
                        name
                    })
                }
            }>Submit</button>
        </div>
    } else {
        return <ProblemManager currentState={currentState} socket={socket} userId={userId} roomId={roomId} currentProblem={currentProblem} leaderBoard={leaderBoard}/>
    }
}
// title : string,
//     description:string,
//     image?:string,
//     answer : AllowedSubmission,
//     startTime:number,
//     options : {
//         id : number,
//         title : string
//     }[],
//     submission : Submission[]
const ProblemManager = ({currentState,socket,userId,roomId,currentProblem,leaderBoard})=>{
    console.log(currentState + " =======current state ======= ");
    const [optionSelected,setOptionSelected] = useState(null); 
    if(currentState === "not_started"){

        return <div>
            <h1 className="text-white">Quiz has not started yet </h1>
        </div> 
        
    }else if(currentState === "question") {
        if(!currentProblem) return <></>
        return    <div className="m-auto w-96 mt-10">
        <span className="text-white">
            Problem
        </span>
        <br />
        <span className="text-white mr-1">
            Title : {currentProblem.title}
        </span>
        <br />
        <br />
        <span className="text-white mr-1">
            Description : {currentProblem.description}
        </span>
        {currentProblem.options.map(option => (
            <div key={option.id} className="m-2">
                <input
                    type="radio"
                    name="optionRadioBtn"
                    id={option.id}
                    value={option.id}
                    className="mr-1"
                    onChange={(e)=>{
                        setOptionSelected(parseInt(e.target.value))
                    }}
                />
                <span className="text-white mr-1">
                    Option {option.id} : {option.title}
                </span>
            </div>
        ))}

        <button type="button" className="outline-1 text-white border-white border p-2 text-center" onClick={() => {
            if(optionSelected=== null){
                return alert("please select a option");
            }
            socket.emit("submit",{
                userId,
                roomId,
                submission : parseInt(optionSelected),
                problemId : currentProblem.id
            })
        }}> Submit </button>
        </div>
    }else if(currentState === "leaderboard") {
        return <div className="text-white m-auto">
            {JSON.stringify(leaderBoard)}
        </div>
    }else{
        return <div className="m-auto mt-5">
            <h1 className="text-white text-lg uppercase"> Some thing happended or Quiz has been {currentState}</h1>
        </div>

    }
}

export default User;