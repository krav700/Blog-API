import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const response = await fetch('/api', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          console.log(response)
          if (!response.ok) {
            throw new Error('Network response was not okay');
          }
          const data = await response.json();
          console.log(data.message)
          setMessage(data.message);
        } catch (err) {
          console.log(err);
        }
      }
    fetchUsers()
  }, [])

  return (
    <>
      <h1>Blog API</h1>
      <h2>{message ?? ''}</h2>
    </>
  )
}

export default App
