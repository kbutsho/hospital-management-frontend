import Contact from '@/components/home/contact/Contact';
import MainLayout from '@/layouts/MainLayout';
import React from 'react';

const ContactPage = () => {
    return (
        <div style={{ marginTop: "100px" }}>
            <Contact />
        </div>
    );
};

export default ContactPage;
ContactPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};