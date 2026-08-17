

function UserGreeting(props){
    if(props.isLogin){
        return (<h1>Welcome Back {props.username}</h1>);
    }
}

export default UserGreeting