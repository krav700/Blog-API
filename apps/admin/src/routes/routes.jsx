import App from "../App";
import Login from "../components/forms/Login";
import CustomErrorBoundary from "../errors/CustomErrorBoundary";
import Register from "../components/forms/Register";
import Blogs from "../components/blogs/Blogs";
import EditBlog from "../components/blogs/EditBlog";
import Users from "../components/users/Users";
import AdminApprovalRequired from "../errors/AdminApprovalRequired";

const routes = [
    {
        path: '/auth/needAdminApproval',
        element: <AdminApprovalRequired />,
        errorElement: <CustomErrorBoundary />,
    },
    {
        path: '/auth/login',
        element: <Login />,
        errorElement: <CustomErrorBoundary />,
    },
    {
        path: '/auth/register',
        element: <Register />,
        errorElement: <CustomErrorBoundary />,
    },
    {
        path: "/",
        element: <App />,
        children: [
            {
                errorElement: <CustomErrorBoundary />,
                children: [
                    {
                        path: "/",
                        element: <Blogs />,
                    },
                    {
                        path: "admin/",
                        element: <Blogs />,
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
