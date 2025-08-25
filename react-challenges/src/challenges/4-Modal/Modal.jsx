import React, { useState } from "react";
import Portal from "./Portal";
export default function Modal(){
  const [isOpen,setIsOpen] = useState(false)
  return (
    <div>
      <h2>This is modal content</h2>
      <button onClick={() => setIsOpen(true)}>Open</button>

      {
        isOpen && (
          <Portal>
            <div style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              width:"400px",
              height:"300px",
              transform: "translate(-50%, -50%)",
              background: "rgba(255, 255, 255, 0.8)",
              color:"black",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              zIndex:1000,
display:"flex",
flexDirection:"column",
margin:"auto",
textAlign:"center",
justifyContent:"center" 
            }}>
              <h2 className="text-3xl">This is modal title</h2>
              <button onClick={() => setIsOpen(false)} style={{color:"whitesmoke"}}>Close</button>
            </div>
          </Portal>
        )
      }
    </div>
  )
} 