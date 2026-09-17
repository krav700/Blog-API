import App from "../App";
import Login from "../forms/Login";
import CustomErrorBoundary from "../errors/CustomErrorBoundary";
import Register from "../forms/Register";
import Blogs from "../blogs/Blogs";
import EditBlog from "../blogs/EditBlog";
import Users from "../users/Users";

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                errorElement: <CustomErrorBoundary />,
                children: [
                    {
                        path: "/auth/login",
                        element: <Login />,
                    },
                    {
                        path: "/auth/register",
                        element: <Register />,
                    },
                    {
                        path: "admin/blogs",
                        element: <Blogs />,
                    },
                    {
                        path: "admin/users",
                        element: <Users />,
                    },
                    {
                        path: "admin/blogs/create",
                        element: <EditBlog />,
                    },
                    {
                        path: "admin/blogs/:blogId",
                        element: <EditBlog />,
                    },
                    {
                      path: '*',
                      element: <CustomErrorBoundary isPageNotFound={true}/>
                    }
                ],
            },
        ],
    },
];

export default routes;
