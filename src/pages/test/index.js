import { errorHandler } from '@/helpers/errorHandler';
import axios from 'axios';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';  // Import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { config } from '@/config';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
            };
            const response = await axios.post(`${config.api}/text/create`, data);
            setSavedContent(response.data.data.content);
        } catch (error) {
            console.log(error);
            errorHandler({ error, toast });
        }
    };

    return (
        <div className='container'>
            <div className='my-5'>
                {typeof window !== 'undefined' && (
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={handleChange}
                        style={{ height: '300px' }}
                    />
                )}
            </div>
            <div className='d-flex justify-content-end'>
                <button className='btn btn-primary fw-bold px-3 mt-2' onClick={handleSave}>save</button>
            </div>
            {savedContent && (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: savedContent }} />
                </div>
            )}
        </div>
    );
};

export default Test;
