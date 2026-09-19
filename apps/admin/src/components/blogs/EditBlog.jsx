import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import fetchApi from "../../api/api";
import { useParams } from "react-router-dom";

function EditBlog() {
    const [title, setTitle] = useState("");
    const [published, setPublished] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentPage, setCommentPage] = useState(0);
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const [, setError] = useState(null);
    const tinyMCAPIKey = import.meta.env.VITE_TINYMC_API_KEY;
    const editorRef = useRef(null);
    let params = useParams();

    useEffect(() => {
        async function getBlogData() {
            try {
                const response = await fetchApi(
                    `/api/admin/blogs/${params.blogId}`,
                    "GET",
                );
                const blogData = response.blog;
                setTitle(blogData.title);
                setPublished(blogData.published);
                setComments(blogData.comments);
                editorRef.current = blogData.content;
            } catch (err) {
                console.log(err);
                setError(() => {
                    throw new Error("Blog post does not exist");
                });
                throw err;
            }
        }

        if (params.blogId) {
            setIsBeingEdited(true);
            getBlogData();
        }
    }, []);

    const saveChanges = async () => {
        if (editorRef.current) {
            try {
                await fetchApi(
                    isBeingEdited
                        ? `/api/admin/blogs/${params.blogId}`
                        : `/api/admin/blogs`,
                    isBeingEdited ? "PUT" : "POST",
                    {
                        title,
                        content: editorRef.current.getContent(),
                        published,
                    },
                );

                return (window.location.href = "/admin/blogs");
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
    };

    const deleteBlogPost = async () => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await fetchApi(`/api/admin/blogs/${params.blogId}`, "DELETE");
                return (window.location.href = "/admin/blogs");
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            return;
        }
    };

    const changeCommentPage = async (newPage) => {
        try {
            const response = await fetchApi(
                `/api/admin/blogs/${params.blogId}/comments/page/${newPage}`,
                "GET",
            );
            setComments(response.comments);

            return;
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    const deleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                const response = await fetchApi(
                    `/api/admin/blogs/${params.blogId}/comments/${commentId}`,
                    "DELETE",
                );
                setComments(response.remainingComments);

                return;
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            return;
        }
    };

    return (
        <div className="flex flex-col gap-3 p-5">
            <h2 className="text-2xl">Public:</h2>
            <div className="flex flex-col content-center items-center">
                <label className="relative inline-block w-15 h-8.5">
                    <input
                        checked={published}
                        className="peer opacity-0 w-0 h-0"
                        type="checkbox"
                        onChange={(e) => {
                            setPublished(e.target.checked);
                        }}
                    />
                    <span
                        className="absolute cursor-pointer 
                    top-0 left-0 right-0 bottom-0 bg-olive-300 transition duration-[.4s] 
                    before:absolute before:content-[''] before:h-6.5 before:w-6.5 
                    before:left-1 before:bottom-1 before:bg-white before:transition before:duration-[.4s]
                peer-checked:bg-green-500 peer-focus:shadow-xs 
                peer-focus:shadow-green-400 peer-checked:before:translate-x-6.5 
                    rounded-4xl before:rounded-[50%]"
                    ></span>
                </label>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-3xl self-start" htmlFor="title">
                    Title:
                </label>
                <input
                    value={title}
                    className="bg-gray-800 rounded-l"
                    type="text"
                    name="title"
                    id="title"
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
            </div>

            <Editor
                initialValue={editorRef.current}
                apiKey={tinyMCAPIKey}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                }}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic underline | " +
                        "alignleft aligncenter alignright | " +
                        "bullist numlist | " +
                        "link image | " +
                        "code | help",
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } p, h1, h2, h3, h4, h5, h6 { margin: 0 }",
                }}
            />
            <button
                onClick={saveChanges}
                className="bg-green-900 text-white rounded-lg border border-gray-500"
            >
                Save Changes
            </button>
            {params.blogId ? (
                <button
                    onClick={deleteBlogPost}
                    className="bg-red-900 text-white rounded-lg border border-gray-500"
                >
                    Delete Blog Post
                </button>
            ) : null}
            {params.blogId ? (
                <div>
                    <h2 className="text-2xl">Comments:</h2>
                    {comments?.map((comment) => (
                        <div
                            className="border border-gray-500 grid grid-cols-[4fr_1fr] my-4"
                            key={comment.id}
                        >
                            <div className="flex flex-col items-start p-2">
                                <h4 className="text-white text-xs max-w-[30%]">
                                    {comment.authoredBy.username}
                                </h4>
                                <h3 className="text-white font-semibold text-lg ps-4 text-start">
                                    {comment.content}
                                </h3>
                            </div>
                            <button
                                onClick={() => {
                                    deleteComment(comment.id);
                                }}
                                className="bg-red-900 text-white border border-gray-500"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <div className="flex gap-4 justify-center p-4">
                        <button
                            disabled={commentPage === 0}
                            onClick={() => {
                                const newPage = commentPage - 1;
                                setCommentPage(newPage);
                                changeCommentPage(newPage);
                            }}
                            className="bg-gray-600"
                        >
                            Previous Page
                        </button>
                        <button
                            disabled={comments.length < 10 || !comments}
                            onClick={() => {
                                const newPage = commentPage + 1;
                                setCommentPage(newPage);
                                changeCommentPage(newPage);
                            }}
                            className="bg-gray-600"
                        >
                            Next Page
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default EditBlog;
