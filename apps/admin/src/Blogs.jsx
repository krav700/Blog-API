import { useEffect, useState } from "react";
import fetchApi from "./api/api";
import { Link } from 'react-router';

function Blogs() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        async function getBlogs() {
            try {
                const response = await fetchApi(`/api/admin/blogs`, "GET");       
                setBlogs(response.blogs);
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        getBlogs();
    }, [])

    function strip(html) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-3 items-end">
                <h1 className="text-4xl sm:text-5xl col-start-2">Blogs</h1>
                <Link to={'/admin/blogs/create'} className="text-xs sm:text-base col-start-3">
                    Create Blog
                </Link>
            </div>
            <div className="grid grid-cols-1 content-center items-center gap-3 p-5 my-5 sm:m-5 border">
                <div className="border w-full p-5">
                        <div className="grid grid-cols-[2fr_2fr_1fr] justify-start items-start gap-4">
                            <h2 className="text-xs sm:text-base font-bold flex text-ellipsis">Title</h2>

                            <h2 className="text-xs sm:text-base font-bold flex">Content</h2>

                            <h2 className="text-xs sm:text-base font-bold">Published</h2>
                        </div>
                    </div>
                {blogs.length !== 0 && blogs.map((blog) => (
                    <Link to={`/admin/blogs/${blog.id}`} className="border w-full p-5">
                        <div className="grid grid-cols-[2fr_2fr_1fr] justify-start items-start gap-4 max-h-5 min-w-0 overflow-hidden" key={blog.id}>
                            <h2 className="text-sm sm:text-base min-w-0 text-ellipsis text-start whitespace-nowrap overflow-hidden max-h-5">{blog.title}</h2>

                            <h3 className="text-xs sm:text-sm min-w-0 text-ellipsis text-start whitespace-nowrap overflow-hidden max-h-5">{strip(blog.content)}</h3>

                            <h3 className="text-xs sm:text-sm">{blog.published ? '✅' : '❌'}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Blogs;
