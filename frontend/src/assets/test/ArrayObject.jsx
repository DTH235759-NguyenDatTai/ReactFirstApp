import { useState } from "react";

function ArrayObject(){
    const [svs, setSvs] = useState([]);
    const [svId, setSvId] = useState("");
    const [svName, setSvName] = useState("");
    const [svClass, setSvClass] = useState("");

    function handleAddSv(event){
        const newSv = {
            id: setId, 
            name: setName,
            class: setClass
        };
        // Them sinh vien moi vao cuoi danh sach ma khong lam thay doi mang cu.
        setSvs(s => [...s, newSv]);
        setSvId("");
        setSvName("");
        setSvClass("");
    }

    return(
        <div>
            <h2>Danh sách sinh viên</h2>
            <ul>
                {svs.map((sv, index) =>
                    <li key={index}>
                        {sv.id} {sv.name} {sv.class} 
                    </li> 
                )}
            </ul>
            <input type="text" value={svId}/> <br />
            <input type="text" value={svName}/> <br />
            <input type="text" value={svClass}/> <br />
            <button onClick={handleAddSv}>Add</button>
        </div>
    );
}

export default ArrayObject
