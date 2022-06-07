import React from "react";

export default function Result(props) {
    console.log("data", props.data)
    return (
        <div>{Object.keys(props.data).map((key) => {
            console.log("[]", props.data[key])
            return (props.data[key].map((value) => {
                console.log("value", value)
                return (<p>{key}:{value}</p>)
            }))
        })}</div>
    )
}