import { useState, useEffect } from 'react'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    console.log(response)
    const data = await response.json();

    console.log(data);

    localStorage.setItem('token', data.token);
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" id='username' name='username' onChange={(e) => {setUsername(e.target.value)}}/>

            <label htmlFor="password">Password:</label>
            <input type="password" id='password' name='password' onChange={(e) => {setPassword(e.target.value)}}/>
            <button>Submit</button>
        </form>
    </div>
  )
}

export default Login
