import { useState } from "react";
import fetchApi from "../../api/api.js";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await fetchApi("/api/auth/register", "POST", {
                firstName,
                lastName,
                email,
                username,
                password,
                confirmPassword,
            });

            if (!data) {
                console.log("No data recieved: ", data);
                return;
            }

            if (data.errors) {
                setErrors(data.errors);
                return;
            }

            window.location.href = "/auth/login";
        } catch (err) {
            console.log("Login failed:", err);
        }
    };

    return (
        <div className="p-5 flex flex-col gap-2 justify-center items-center h-screen w-screen">
            {errors ? (
                <div className="flex flex-col justify-center items-center p-5">
                    {errors.map((error) => (
                        <div>
                            <h3 className="text-sm text-red-500">
                                {error.msg}
                            </h3>
                        </div>
                    ))}
                </div>
            ) : null}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center"
            >
                <fieldset className="flex flex-col gap-2 justify-center items-center w-fit">
                    <legend>Register</legend>
                    <div className="grid grid-cols-[1fr_2fr] gap-y-3">
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
                        <label htmlFor="confirmPassword">
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                    </div>
                        <button className="w-full p-1 rounded-lg bg-blue-900 text-white">Submit</button>
                </fieldset>
            </form>
        </div>
    );
}

export default Register;
