import { useState } from "react"

function MyComponent (){
    const [milkTeas, setMilkTeas] = useState(["Hồng trà Đài Loan", "Hông trà Vải Thiều", "Trà bí đao"]);

    function handleAddMilkTeas(event) {
        const newMilkTea = document.getElementById("mtInput").value;
        document.getElementById("mtInput").value = "";
        
        setMilkTeas(m => [...m, newMilkTea]);
    }

    function handleRemove(index){
        setMilkTeas(milkTeas.filter((__, i) => i !== index));
    }

    return(
        <div>
            <h1>Danh sách Trà sữa</h1>
            <ul>
                {milkTeas.map((milkTea, index) =>
                    <li key={index} onClick={() => handleRemove(index)}>
                        {milkTea}
                    </li>
                )}
            </ul>
            <input type="text" id="mtInput" placeholder="Nhập tên trà sữa mới"/>
            <button onClick={handleAddMilkTeas}>Thêm món</button>
        </div>
    );
}

export default MyComponent