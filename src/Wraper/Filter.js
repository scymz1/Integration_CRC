import {Button} from "@mui/material";

export default function Filter(props) {
    function handleClick(){
        props.setData({
            ...props.data,
            value: ['value1', 'value2']
        })
    }
    return (
        <Button onClick={handleClick}>
            Set New
        </Button>
    )
}