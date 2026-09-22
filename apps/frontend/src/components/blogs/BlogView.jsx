import { useEffect, useState } from "react";
import fetchApi from "../../api/api";
import { Link } from "react-router";
import { useParams, useOutletContext } from "react-router-dom";

function BlogView() {
    const [blogData, setBlogData] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentBody, setCommentBody] = useState("");
    const { user } = useOutletContext();
    let params = useParams();

    useEffect(() => {
        async function getBlogs() {
            try {
                const response = await fetchApi(
                    `/api/blogs/${params.blogId}`,
                    "GET",
                );
                
                setBlogData(response.blog);
                setComments(response.blog.comments);
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        getBlogs();
    }, []);

    const getOrdinal = (d) => {
        if (d > 3 && d < 21) return "th";
        switch (d % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    async function postComment() {
        try {
            const response = await fetchApi(
                `/api/blogs/${params.blogId}/comments`,
                "POST",
                { content: commentBody },
            );
            console.log(response)
            setCommentBody('')
            setComments(response.comments);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    return (
        <div className="mb-20 p-4 flex flex-col justify-center gap-4 max-w-215 mx-auto">
            <div className="flex justify-start w-full">
                <h1 className="flex items-center gap-2 self-start text-3xl sm:text-4xl col-start-2">
                    <Link to={"/blogs"}>
                        {" "}
                        <h2 className="text-xl text-mist-300">Home</h2>
                    </Link>
                </h1>
            </div>
            <div>
                {blogData && (
                    <div className="border border-gray-800 w-full h-fit p-5 bg-black rounded-lg items-start gap-4 min-w-0 overflow-hidden">
                        <div className="flex flex-col items-start">
                            <h4 className="text-xs text-mist-500 font-medium">
                                {new Date(
                                    blogData.createdAt,
                                ).toLocaleDateString("en-US", {
                                    month: "long",
                                }) +
                                    ` ${new Date(blogData.createdAt).getUTCDate()}${getOrdinal(new Date(blogData.createdAt).getUTCDate())}, ` +
                                    new Date(
                                        blogData.createdAt,
                                    ).getUTCFullYear()}
                            </h4>

                            <h1 className="text-sm sm:text-2xl my-4 tracking-[0.01rem] min-w-0 text-ellipsis text-start overflow-hidden">
                                {blogData.title}
                            </h1>

                            <article
                                className="[&_h1]:mt-4 [&_h2]:mt-4 [&_h3]:mt-4 [&_h4]:mt-4 [&_h5]:mt-4 [&_h6]:mt-4 text-mist-50 text-start flex flex-col gap-2"
                                dangerouslySetInnerHTML={{
                                    __html: blogData.content,
                                }}
                            ></article>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <h2 className="flex ">Comments:</h2>
                {user ? (
                    <div className="flex flex-col my-2 gap-2">
                        <textarea
                            value={commentBody}
                            name="content"
                            id="content"
                            rows={3}
                            onChange={(e) => {
                                setCommentBody(e.target.value);
                            }}
                            className="resize-none border border-gray-800 bg-gray-700 p-1"
                        ></textarea>
                        <button
                            onClick={postComment}
                            className="w-fit px-4 py-1 border border-gray-800 bg-gray-800"
                        >
                            Comment
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col my-2 gap-2">
                        <h3>You need to be logged in to comment!</h3>
                        <Link to={"/auth/login"}>
                            <button className="w-fit px-4 py-1 border border-gray-800 bg-gray-800">
                                Log In
                            </button>
                        </Link>
                    </div>
                )}
                {!comments ? (
                    <h3 className="font-normal text-sm my-4">
                        No comments yet! Be the first to Comment
                    </h3>
                ) : (
                    <div className="flex flex-col gap-2">
                        {comments.length > 0 ? comments?.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-sm flex flex-col items-start border border-gray-800 p-2"
                            >
                                <h4 className="text-xs">
                                    {comment.authoredBy.username} <span className="text-[0.60rem]">{comment.createdAt.toString().slice(0,10)}</span>
                                </h4>
                                <h3 className="pl-4 text-base text-white">
                                    {comment.content}
                                </h3>
                            </div>
                        )) : null}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BlogView;
