import { useState } from "react"

export const CreateProblem = ({ socket, roomId }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [answer, setAnswer] = useState(0);
    const [options, setOptions] = useState([
        { id: 0, title: "" },
        { id: 1, title: "" },
        { id: 2, title: "" },
        { id: 3, title: "" },
    ])
    return (
        <div className="m-auto w-96 mt-10">
            <span className="text-white">
                Create Problem
            </span>
            <br />
            <span className="text-white mr-1">
                Title :
            </span>
            <input type="text" name="" id="" placeholder="enter your problem here" onChange={(e) => {
                setTitle(e.target.value);
            }} />
            <br />
            <br />
            <span className="text-white mr-1">
                Description :
            </span>
            <input type="text" name="" id="" placeholder="enter your problem here" onChange={(e) => {
                setDescription(e.target.value);
            }} />

            {[0, 1, 2, 3].map(optionId => (
                <div key={optionId} className="m-2">
                    <input
                        type="radio"
                        name="optionRadioBtn"
                        id={optionId}
                        checked= {optionId === answer}
                        value={optionId}
                        className="mr-1"
                        onChange={(e) => {
                            setAnswer(parseInt(e.target.value));
                        }}
                    />
                    <span className="text-white mr-1">
                        Option {optionId} :
                    </span>
                    <input
                        type="text"
                        name=""
                        id={optionId}
                        onChange={(e) => {
                            setOptions(options =>
                                options.map(x => {
                                    if (x.id === optionId) {
                                        return {
                                            ...x,
                                            title: e.target.value
                                        };
                                    }
                                    return x; // Don't forget to return the unchanged item
                                })
                            );
                        }}
                    />
                </div>
            ))}

            <button type="button" className="outline-1 text-white border-white border p-2 text-center" onClick={() => {
                socket.emit("createproblem", {
                    roomId: roomId,
                    problem: {
                        title: title,
                        description: description,
                        options,
                        answer
                    }
                });
            }}>Add Problem</button>
        </div>
    )
}