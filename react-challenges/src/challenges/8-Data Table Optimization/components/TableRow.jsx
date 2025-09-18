import React from "react"

function TableRow({product}){
    return(
        <tr style={{width:"50vw"}}>
            <td  className="border px-2 py-1">{product.id}</td>
            <td  className="border px-2 py-1">{product.title}</td>
            <td  className="border px-2 py-1">{product.price}</td>
        </tr>
    )
}
export default React.memo(TableRow)