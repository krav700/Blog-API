import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

export default function Header() {
    const location = useLocation();

    return (
        <header className="grid grid-cols-2 justify-evenly items-center sticky w-full bg-gray-800">
            {location.pathname !== '/admin/users' ? 
            <Link to={'/admin/users'} viewTransition className="border h-full w-full p-4">
                <h2>Users</h2>
            </Link> 
            :
            <Link to={''} viewTransition className="bg-gray-900 border h-full w-full p-4 pointer-events-none">
                <h2>Users</h2>
            </Link> }
            {location.pathname !== '/admin/blogs' ? 
            <Link to={'/admin/blogs'} viewTransition className="border h-full w-full p-4">
                <h2>Blogs</h2>
            </Link> 
            :
            <Link to={''} viewTransition className="bg-gray-900 border h-full w-full p-4 pointer-events-none">
                <h2>Blogs</h2>
            </Link> }
        </header>
    )
}