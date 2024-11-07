export const QuizControls = ({socket,roomId})=>{
    return <div className="w-96 m-auto text-center mt-10 border-t border-white">
        <h1 className="text-white mt-4">
            Quiz Controls
        </h1>
        <button className="text-white text-lg border border-white p-1" onClick={
            ()=>{
                console.log(" quiz next =============");
                socket.emit("next",{
                    roomId
                })
            }
        }>
        Next
        </button>
        <button type="button" className="text-white text-lg border border-white p-2 m-2" onClick={(e)=>{
            socket.emit("start_quiz",{
                roomId
            })
        }}> Start Quiz</button>
    </div>
}