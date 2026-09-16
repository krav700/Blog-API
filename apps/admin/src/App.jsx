import { Outlet } from 'react-router-dom'
import Header from './layout/Header'

function App({ children }) {

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
