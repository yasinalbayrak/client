import React, { useCallback, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import './TextEditor.css';

const modules = {
    toolbar: [
        // First row
        [{ 'header': [3, 4, 5, 6, false] }, { 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }, 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'
            , { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }, { 'direction': 'rtl' }, { 'color': [] }, { 'background': [] }, { 'align': [] }, 'link', 'clean'
        ], // First Row

        // Second row
        [],
    ],
};


const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'list', 'bullet', 'script', 'indent', 'direction',
    'color', 'background', 'align',
    'link', 'image', 'video', 'formula', 'course', 'fullname'
];

function TextEditor({ value, setValue, bc, bg, id }) {
    const quillRef = useRef(null);

    useEffect(() => {
        let styleElement = document.getElementById(`dynamic-border-styles-${id}`);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = `dynamic-border-styles-${id}`;
            document.head.appendChild(styleElement);
        }

        styleElement.innerHTML = `
            .editor-wrapper-${id} .ql-container {
                border: 2px solid ${bc} !important;
            }
            .editor-wrapper-${id} .ql-toolbar {
                border: 2px solid ${bc} !important;
                border-bottom: none !important;
            }
            .editor-wrapper-${id} .quill {
                background-color: ${bg} !important;
            }
            .custom-course {
                background-color: yellow;
                color: red;
                font-weight: bold;
            }
            .custom-fullname {
                background-color: lightblue;
                color: green;
                font-weight: bold;
            }
        `;
    }, [bc, id, bg]);

    const handleChange = (content, delta, source, editor) => {
        setValue(content);
    };

    return (
        <div className={`editor-wrapper-${id}`}>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
            />
        </div>
    );
}

export default TextEditor;
