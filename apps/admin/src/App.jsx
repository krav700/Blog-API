import { Outlet } from "react-router-dom";
import Header from "./layout/Header";
import { useEffect } from "react";
import fetchApi from "./api/api";

function App() {

  useEffect(() => {
    async function isAdminLoggedIn() {
        try {
            const user = await fetchApi(`/api/admin/me`, "GET");

            if (!user?.isAdmin) {
              // window.location.href = "/auth/needAdminApproval";
            }

            return;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    isAdminLoggedIn()

    if (!localStorage.getItem('token')) {
      window.location.href = "/auth/login";
    }

  }, [])

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default App;
