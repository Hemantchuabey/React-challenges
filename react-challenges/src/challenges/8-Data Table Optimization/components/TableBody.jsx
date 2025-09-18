import TableRow from "./TableRow";
import {Virtuoso} from 'react-virtuoso';

export default function TableBody({products}){
    return (
    <tbody className="w-[100vw]">
      <tr>

      <Virtuoso
        useWindowScroll
        data={products}
        itemContent={(index, product) => <TableRow key={product.id} product={product} />}
        style={{ height: "500px" }} 
      />
      </tr>
    </tbody>
    )
}