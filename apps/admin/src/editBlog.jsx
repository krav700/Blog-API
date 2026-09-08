import { useRef } from "react";
import "./App.css";
import { Editor } from "@tinymce/tinymce-react";

function EditBlog() {
    const tinyMCAPIKey = import.meta.env.VITE_TINYMC_API_KEY;
    const editorRef = useRef(null);
    const log = () => {
        console.log("Yo")

        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    return (
        <>
            <Editor
                apiKey={tinyMCAPIKey}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                    console.log("TinyMCE editor:", editor);
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
            <button onClick={log}>Log editor content</button>
        </>
    );
}

export default EditBlog;
