import { errorHandler } from '@/helpers/errorHandler';
import axios from 'axios';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { config } from '@/config';

const Test = () => {
    const [content, setContent] = useState('');
    const [savedContent, setSavedContent] = useState('');
    const handleChange = (value) => {
        setContent(value);
    };
    const handleSave = async () => {
        try {
            const data = {
                content: JSON.stringify({ content })
            }
            const response = await axios.post(`${config.api}/text/create`, data)
            setSavedContent(response.data.data.content);
        } catch (error) {
            console.log(error)
            errorHandler({ error, toast })
        }
    };
    return (
        <div className='container'>
            <ReactQuill
                theme="snow"
                value={content}
                onChange={handleChange}
            />
            <button onClick={handleSave}>Save</button>
            {savedContent && (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: savedContent }} />
                </div>
            )}
        </div>
    );
};

export default Test;