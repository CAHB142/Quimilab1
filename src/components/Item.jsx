import { Paper} from '@mui/material'

function Item({item})
{
    return (

        <Paper>
            <img src = {item.image} alt={item.title} className = "imagenesCar"/>
            <div className = "titleCar">
                <h2> {item.title} </h2>
            </div>        
        </Paper>
        
    )
}                           

export default Item