import React from 'react';
import html2canvas from 'html2canvas';

const HomePage = () => {
    const handleDownload = async (name) => {
        const element = document.createElement('div');
        element.style.cssText = 'position: absolute; left: -9999px;';
        element.innerHTML = `
         <div style="width: 200px;
            height: 100px;
            background-color: black;
            font-size: 20px;">
         Hello, ${name}!
         </div>
        `;
        document.body.appendChild(element);
        let link;
        try {
            const canvas = await html2canvas(element);
            const imageURL = canvas.toDataURL('image/png');
            link = document.createElement('a');
            link.href = imageURL;
            link.download = `${name}_image.png`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
        } finally {
            document.body.removeChild(element);
            if (link) {
                document.body.removeChild(link);
            }
        }
    };

    const names = ['koushik', 'utsho'];
    return (
        <div>
            {names.map((name, index) => (
                <div key={index}>
                    <button onClick={() => handleDownload(name)}>download</button>
                </div>
            ))}
        </div>
    );
};

export default HomePage;
