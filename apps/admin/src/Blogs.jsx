import { useEffect, useState } from "react";
import "./App.css";
import fetchApi from "./api/api";
import { Link } from 'react-router';

function Blogs() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        async function getBlogs() {
            try {
                const response = await fetchApi(`/api/admin/blogs`, "GET");       
                // console.log(response.blogs);
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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 p-5 border">
            {blogs.length !== 0 && blogs.map((blog) => (
                <div className="border w-fit p-5">
                    {console.log(blog)}
                    <Link to={`/admin/blogs/${blog.id}`}>
                        {console.log(blog.title)}
                        <h2>{blog.title}</h2>

                        <h3>{strip(blog.content)}</h3>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default Blogs;
