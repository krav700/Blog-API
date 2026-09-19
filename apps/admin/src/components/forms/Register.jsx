import { useState } from "react";
import fetchApi from "../../api/api.js";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await fetchApi("/api/auth/register", "POST", {
                firstName,
                lastName,
                email,
                username,
                password,
                confirmPassword
            });

            if (!data) {
                console.log("No data recieved: ", data);
                return;
            }

            localStorage.setItem("token", data.token);
            window.location.href = "/auth/login";
        } catch (err) {
            console.log("Login failed:", err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    onChange={(e) => {
                        setFirstName(e.target.value);
                    }}
                />
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    onChange={(e) => {
                        setLastName(e.target.value);
                    }}
                />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
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
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                />
                <button>Submit</button>
            </form>
        </div>
    );
}

export default Register;
