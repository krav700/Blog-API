import { useState } from "react";
import fetchApi from "../../api/api.js";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");

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

            if (data.errors) {
                setErrors(data.errors);
                return;
            }

            localStorage.setItem("username", username);
            localStorage.setItem("token", data.token);
            window.location.href = data.isAdmin
                ? "/admin/blogs"
                : "/auth/needAdminApproval";
        } catch (err) {
            console.log("Login failed:", err);
            setErrors([{msg: 'Incorrect username or password'}]);
        }
    };

    return (
        <div className="p-5 flex flex-col gap-2 justify-center items-center h-screen w-screen">
            {errors ? (
                <div className="flex flex-col justify-center items-center p-5">
                    {errors.map((error) => (
                        <div key={error.msg}>
                            <h3 className="text-sm text-red-500">
                                {error.msg}
                            </h3>
                        </div>
                    ))}
                </div>
            ) : null}
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                <fieldset className="flex flex-col gap-2 justify-center items-center w-fit">
                    <legend>Login</legend>
                    <div className="grid grid-cols-[1fr_2fr] gap-y-3">
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
                    </div>
                    <button className="w-full p-1 rounded-lg bg-blue-900 text-white">Submit</button>
                </fieldset>
            </form>
        </div>
    );
}

export default Login;
