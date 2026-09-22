import { useEffect, useState } from "react";
import fetchApi from "../../api/api";

function Users() {
    const [users, setUsers] = useState([]);
    const [userPage, setUserPage] = useState(0);

    useEffect(() => {
        async function getBlogs() {
            try {
                const response = await fetchApi(`/api/admin/users`, "GET");
                setUsers(response.users);
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        getBlogs();
    }, []);

    const changeUserPage = async (newPage) => {
        try {
            const response = await fetchApi(
                `/api/admin/users/pages/${newPage}`,
                "GET",
            );
            setUsers(response.users);

            return;
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    async function promoteToAdmin(user) {
        if (window.confirm("Are you sure you want to promote this user?")) {
            try {
                await fetchApi(`/api/admin/users/${user.id}`, "PUT", {
                    isAdmin: true,
                });

                return;
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            return;
        }
    }

    async function deleteUser(user) {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetchApi(`/api/admin/users/${user.id}`, "DELETE");
                console.log(response);
                setUsers(response.users);

                return;
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            return;
        }
    }

    return (
        <div className="p-4">
            <div>
                <h1 className="text-4xl sm:text-5xl col-start-2">Users</h1>
            </div>
            <div className="grid grid-cols-1 content-center items-center gap-3 p-5 my-5 sm:m-5 border">
                <div className="sticky top-0 bg-gray-700 border w-full p-5">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] justify-center justify-items-start items-center gap-4">
                        <h2 className="text-xs sm:text-base font-bold flex text-ellipsis">
                            Name
                        </h2>

                        <h2 className="text-xs sm:text-base font-bold flex">
                            Email
                        </h2>

                        <h2 className="text-xs sm:text-base font-bold flex">
                            Username
                        </h2>

                        <h2 className="text-xs sm:text-base font-bold flex">
                            Promote Admin
                        </h2>

                        <h2 className="text-xs sm:text-base font-bold flex">
                            Delete Account
                        </h2>
                    </div>
                </div>
                {users.length !== 0 &&
                    users.map((user) => (
                        <div className="border w-full p-5" key={user.id}>
                            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] justify-start justify-items-start items-center gap-4 max-h-max min-w-0 overflow-hidden">
                                <h2 className="scrollbar-none overflow-x-scroll text-xs sm:text-sm text-start whitespace-nowrap max-w-full">
                                    {user.firstName} {user.lastName}
                                </h2>

                                <h3 className="scrollbar-none overflow-x-scroll text-xs sm:text-sm text-start whitespace-nowrap max-w-full">
                                    {user.email}
                                </h3>

                                <h3 className="scrollbar-none overflow-x-scroll text-xs sm:text-sm text-start whitespace-nowrap max-w-full">
                                    {user.username}
                                </h3>

                                <button
                                    disabled={user.isAdmin}
                                    onClick={() => {
                                        promoteToAdmin(user);
                                    }}
                                    className="disabled:bg-gray-500 disabled:text-gray-400 w-full p-1 rounded-lg bg-blue-900 text-white"
                                >
                                    Promote
                                </button>

                                <button
                                    disabled={localStorage.getItem('username') === user.username}
                                    onClick={() => {
                                        deleteUser(user);
                                    }}
                                    className="disabled:bg-gray-500 disabled:text-gray-400 w-full p-1 rounded-lg bg-red-900 text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="flex gap-4 justify-center p-4">
                <button
                    disabled={userPage === 0}
                    onClick={() => {
                        const newPage = userPage - 1;
                        setUserPage(newPage);
                        changeUserPage(newPage);
                    }}
                    className="bg-gray-600 p-2 rounded-lg"
                >
                    Previous Page
                </button>
                <button
                    disabled={users.length < 10 || !users}
                    onClick={() => {
                        const newPage = userPage + 1;
                        setUserPage(newPage);
                        changeUserPage(newPage);
                    }}
                    className="bg-gray-600 p-2 rounded-lg"
                >
                    Next Page
                </button>
            </div>
        </div>
    );
}

export default Users;
