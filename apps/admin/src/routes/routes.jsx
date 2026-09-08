import App from "../App";
import Login from "../forms/Login"
import PageNotFound from "../errors/PageNotFound";
import Register from "../forms/Register";
import EditBlog from "../editBlog";

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
    path: "admin/blogs/:blogId",
    element: <EditBlog />
  }
];

export default routes;
