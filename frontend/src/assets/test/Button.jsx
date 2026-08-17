
function Button(){
    const handleClick = (name) => alert(`Ay da ${name}`);
    
    return(
        <>
            <button onClick={() => handleClick("Tài")}>Nhấn vào tôi</button>
        </>
    );
}

export default Button;