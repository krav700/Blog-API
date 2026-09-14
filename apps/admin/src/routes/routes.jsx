import App from "../App";
import Login from "../forms/Login"
import PageNotFound from "../errors/PageNotFound";
import Register from "../forms/Register";
import Blogs from "../Blogs";
import EditBlog from "../EditBlog";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/auth/login",
    element: <Login />
  },
  {
    path: "/auth/register",
    element: <Register />
  },
  {
    path: "admin/blogs",
    element: <Blogs />
  },
  {
    path: "admin/blogs/create",
    element: <EditBlog />
  },
  {
    path: "admin/blogs/:blogId",
    element: <EditBlog  />
  },
];

export default routes;
