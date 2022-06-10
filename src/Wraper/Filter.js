import {Button} from "@mui/material";

export default function Filter(props) {
    function handleClick(){
        props.setData({
            ...props.data,
            value: ['value1', 'value2']
        })
    }
    return (
        // Dropdown, Cascading Menu

        // Component-factory

        <Button onClick={handleClick}>
            Set New
        </Button>
    )
}