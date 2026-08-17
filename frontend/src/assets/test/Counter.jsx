import { useState } from "react";

function Counter(){
    const[count, setCount] = useState(0);

    const increaseNumber = () => {
        setCount(count + 1);
    }

    const decreaseNumber = () => {
        setCount(count - 1);
    }

    const resetNumber = () => {
        setCount(0);
    }

    return(
        <div>
            <p>{count}</p>
            <button onClick={decreaseNumber}>Decrease</button>
            <button onClick={resetNumber}>Reset</button>
            <button onClick={increaseNumber}>Increase</button>
        </div>
    );
}

export default Counter;