import { useEffect, useState } from "react";
import fetchApi from "../api/api";

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

    return (
        <div className="p-4">
            <div>
                <h1 className="text-4xl sm:text-5xl col-start-2">Users</h1>
            </div>
            <div className="grid grid-cols-1 content-center items-center gap-3 p-5 my-5 sm:m-5 border">
                <div className="sticky top-0 bg-gray-700 border w-full p-5">
                    <div className="grid grid-cols-[2fr_2fr_1fr] justify-start items-start gap-4">
                        <h2 className="text-xs sm:text-base font-bold flex text-ellipsis">
                            Name
                        </h2>

                        <h2 className="text-xs sm:text-base font-bold flex">
                            Email
                        </h2>

                        <h2 className="text-xs sm:text-base font-bold">
                            Username
                        </h2>
                    </div>
                </div>
                {users.length !== 0 &&
                    users.map((user) => (
                        <div className="border w-full p-5" key={user.id}>
                            <div className="grid grid-cols-[2fr_2fr_1fr] justify-start items-start gap-4 max-h-5 min-w-0 overflow-hidden">
                                <h2 className="text-sm sm:text-base min-w-0 text-ellipsis text-start whitespace-nowrap overflow-hidden max-h-5">
                                    {user.firstName} {user.lastName}
                                </h2>

                                <h3 className="text-xs sm:text-sm min-w-0 text-ellipsis text-start whitespace-nowrap overflow-hidden max-h-5">
                                    {user.email}
                                </h3>

                                <h3 className="text-xs sm:text-sm">
                                    {user.username}
                                </h3>
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
                    className="bg-gray-600"
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
                    className="bg-gray-600"
                >
                    Next Page
                </button>
            </div>
        </div>
    );
}

export default Users;
