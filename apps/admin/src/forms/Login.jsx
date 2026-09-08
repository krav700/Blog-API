import { useState } from "react";
import fetchApi from "../api/api.js";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await fetchApi("/api/auth/login", "POST", {
                username,
                password,
            });

            if (!data) {
                console.log("No data recieved: ", data);
                return;
            }

            localStorage.setItem("token", data.token);
            window.location.href = "/";
        } catch (err) {
            console.log("Login failed:", err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <button>Submit</button>
            </form>
        </div>
    );
}

export default Login;
