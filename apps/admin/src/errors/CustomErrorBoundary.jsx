import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import PageNotFound from "./PageNotFound";

export default function CustomErrorBoundary({ isPageNotFound }) {
    const error = useRouteError();
    console.log(error)
    // Handle specific router responses (like json/responses thrown)
    console.log(isPageNotFound)
    if (isRouteErrorResponse(error) || isPageNotFound) {
        if (error?.status === 404 || isPageNotFound) {
            return <PageNotFound />;
        }
        console.log(error);
        return (
            <div>
                <h1>{error.status} Error</h1>
                <p>{error.data}</p>
            </div>
        );
    }

    // Handle standard JavaScript errors thrown via `throw new Error()`
    if (error instanceof Error) {
        console.log(error);
        return (
            <div className="h-screen w-screen flex flex-col justify-center items-center">
                <h1 className="tracking-[0.125rem]">Unexpected Error</h1>
                <p className="tracking-[0.125rem]">{error.message}</p>
                <Link to="/admin/blogs" viewTransition>
                    You can go back to the blogs page by clicking here, though!
                </Link>
            </div>
        );
    }


    return (
        <div>
            <h1>Unknown Error Occurred</h1>
        </div>
    );
}
