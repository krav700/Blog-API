import App from "../App";
import Login from "../forms/Login"
import PageNotFound from "../errors/PageNotFound";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/auth/login",
    element: <Login />
  }
];

export default routes;
