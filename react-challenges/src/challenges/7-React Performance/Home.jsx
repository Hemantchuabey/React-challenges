import { useState } from "react";
import List from "./component/List";
import { useItem } from "./hooks/useItem";

export default function Home() {
  const {items,loading,error} = useItem()
  const [count,setCount] = useState(0)
      console.log("Items : ",items)
      if(loading) return <h2>Loading....</h2>
      if(error) return <h2>Error  : {error}</h2>
  return (
    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:"20px", position:"relative"}}>
      <h1>Product List</h1>
        <button onClick={() => setCount(count + 1)}>
        Increment Counter ({count})
      </button>

      <List items={items} />
    </div>
  );
}
