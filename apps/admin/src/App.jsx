import { Outlet } from "react-router-dom";
import Header from "./layout/Header";
import { useEffect, useState } from "react";
import fetchApi from "./api/api";

function App() {
  const [logout, setLogout] = useState(false);

    useEffect(() => {
        async function isAdminLoggedIn() {
            try {
                const response = await fetchApi(`/api/auth/me`, "GET");

                if (!response?.user?.isAdmin) {
                    window.location.href = "/auth/needAdminApproval";
                }

                return;
            } catch (err) {
                window.location.href = "/auth/login";
                throw err;
            }
        }
        isAdminLoggedIn();

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth/login";
        }
    }, [logout]);

    async function Logout() {
        try {
            await fetchApi(`/api/auth/logout`, "POST");
            setLogout(true);
            return window.alert("Successfully Logged out!");
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    return (
        <>
            <Header />
            <div className="fixed top-0 right-0 p-4 z-10">
                <button
                    onClick={Logout}
                    className="cursor-pointer bg-mist-800 px-2 py-1 font-medium text-sm text-mist-500"
                >
                    Log out
                </button>
            </div>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default App;
