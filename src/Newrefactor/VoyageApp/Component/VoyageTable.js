import { useState } from "react"
// import { voyage_default_list } from "../../../../Component/VoyagePage/Result/Table/tableVars"
// import ColSelector from "../../../CommonComponent/ColumnSelector"


export default function VoyageTable(props) {

    const { variables_tree, options_flat } = props.state

    const [cols, setCols] = useState(voyage_default_list)


    return (
        <div>
            <ColSelector state={{ cols, setCols, variables_tree, options_flat }} />

        </div>


    )
}