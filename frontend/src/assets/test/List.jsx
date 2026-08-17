
function List(props){
    const milkTeas = props.items;
    const category = props.category;

    const listMilk = milkTeas.map(milkTea => <li key={milkTea.id}>{milkTea.name} - {milkTea.tea}</li>);

    return(
        <>
            <h3>{category}</h3>
            <ul>{listMilk}</ul>
        </>
    );
}

export default List