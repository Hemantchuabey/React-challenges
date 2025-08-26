import { useState } from 'react'
import './App.css'
import Modal from './challenges/4-Modal/Modal'



function App() {
  const [isOpen,setIsOpen] = useState(false)

  return (

<div>

<div>
      <h2>This is modal content</h2>
      <button onClick={() => setIsOpen(true)}>Open</button>

      {
        isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
 <h2>Accessible Modal</h2>
          <input className='white border radius-small' placeholder="Type here..." />
          <button>Save</button>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          </Modal>
        )
      }
    </div>

   
  </div>
  )
}

export default App
