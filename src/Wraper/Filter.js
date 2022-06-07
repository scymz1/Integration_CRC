import {Button} from "@mui/material";

export default function Filter(props) {
    function handleClick(){
        props.setData({
            ...props.data,
            range: [0, 1700]
        })
    }
    return (
        <Button onClick={handleClick}>
            Set New
        </Button>
    )
}