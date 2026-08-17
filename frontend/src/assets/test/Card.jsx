import profilePic from './assets/pic1.jpg'

function Card(props){
    return(
        <div className="card">
            <h1>Name: {props.name}</h1>
            <p>Class: {props.class}</p>
        </div>
    );
}

export default Card