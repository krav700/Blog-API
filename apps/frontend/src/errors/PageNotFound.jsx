import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="tracking-[0.125rem]">Oh no, this route doesn't exist!</h1>
      <Link to="/blogs" viewTransition>
        You can go back to the blogs page by clicking here, though!
      </Link>
    </div>
  );
};

export default PageNotFound;
