import { Link } from "react-router-dom";

const AdminApprovalRequired = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="tracking-[0.125rem]">No Admin Permissions!</h1>
      <h2 className="tracking-[0.125rem]">Please contact an admin for permissions</h2>
      <Link to="/auth/login" viewTransition>
        You can go back to the login page by clicking here!
      </Link>
    </div>
  );
};

export default AdminApprovalRequired;
