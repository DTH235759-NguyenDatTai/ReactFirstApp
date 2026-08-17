import { useState } from "react";

function Student(){
        const [name, setName] = useState("");
        const [className, setClassName] = useState(""); 
        const [displayName, setDisplayName] = useState("");
        const [displayClass, setDisplayClass] = useState("");

    const handleSubmit = () => {
        setDisplayName(name);
        setDisplayClass(className);
    };
    return(
        <>
            <div className="input">
                <input 
                    type="text" 
                    id="name" 
                    placeholder="Nhập tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="text" 
                    id="class" 
                    placeholder="Nhập lớp của bạn"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                />
                <button id="button" onClick={handleSubmit}>Submit</button>
            </div>
            <div className="card">
                <h1>Name: {displayName}</h1>
                <p>Class: {displayClass}</p>
            </div>        
        </>

    );
}

export default Student