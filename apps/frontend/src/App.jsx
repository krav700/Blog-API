import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import fetchApi from "./api/api";

function App() {
    const [user, setUser] = useState();
    const [logout, setLogout] = useState(false);

    useEffect(() => {
        async function isLoggedIn() {
            try {
                const response = await fetchApi(`/api/auth/me`, "GET");
                setUser(response.user);
                return;
            } catch (err) {
                console.log('User not logged in');
            }
        }
        isLoggedIn();
    }, [logout]);

    async function Logout() {
        try {
            await fetchApi(`/api/auth/logout`, "POST");
            setUser(null);
            setLogout(true);
            return window.alert("Successfully Logged out!");
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    return (
        <>
            <div className="absolute top-0 right-0 p-4 z-10">
                {user ? (
                    <button
                        onClick={Logout}
                        className="cursor-pointer bg-transparent font-medium text-sm text-mist-500"
                    >
                        Log out
                    </button>
                ) : (
                    <button
                        onClick={() => { window.location.href = '/auth/login'; }}
                        className="cursor-pointer bg-transparent font-medium text-sm text-mist-500"
                    >
                        Log in
                    </button>
                )}
            </div>
            <main>
                <Outlet context={{user, setUser}} />
            </main>
        </>
    );
}

export default App;
