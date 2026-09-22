import { useEffect, useState } from "react";
import fetchApi from "../../api/api";
import { Link } from "react-router";
import { Rss } from "lucide-react";

function Blogs() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        async function getBlogs() {
            try {
                const response = await fetchApi(`/api/blogs`, "GET");
                setBlogs(response.blogs);
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        getBlogs();
    }, []);

    function strip(html) {
        let doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    }

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

    return (
        <div className="p-4 flex flex-col justify-center gap-4 max-w-[1234px] mx-auto">
            <div className="flex justify-start w-full">
                <h1 className="flex items-center gap-2 self-start text-3xl sm:text-4xl col-start-2">
                    The latest krav70 News{" "}
                    <Rss className="text-mist-400" size={32} />
                </h1>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
                {blogs.length !== 0 &&
                    blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="border border-gray-800 w-full p-5 bg-black rounded-lg grid grid-rows-[3fr_1fr] items-start gap-4 h-72 min-w-0 overflow-hidden"
                        >
                            <div className="flex flex-col items-start">
                                <h4 className="text-xs text-mist-500 font-medium">
                                    {new Date(
                                        blog.createdAt,
                                    ).toLocaleDateString("en-US", {
                                        month: "long",
                                    }) +
                                        ` ${new Date(blog.createdAt).getUTCDate()}${getOrdinal(new Date(blog.createdAt).getUTCDate())}, ` +
                                        new Date(
                                            blog.createdAt,
                                        ).getUTCFullYear()}
                                </h4>

                                <h2 className="max-h-19 font-bold text-sm sm:text-base min-w-0 text-ellipsis text-start overflow-hidden">
                                    {blog.title}
                                </h2>

                                <h3 className="max-h-25  text-xs sm:text-sm min-w-0 text-ellipsis text-start overflow-hidden text-white font-light">
                                    {strip(blog.content)}
                                </h3>
                            </div>

                            <Link
                                to={`/blogs/${blog.id}`}
                                className="self-end"
                                viewTransition
                            >
                                <button className="self-end w-full h-8 text-sm bg-mist-900 text-mist-400 hover:bg-mist-700 hover:text-mist-300 transition duration-200">
                                    Read More
                                </button>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Blogs;
