import { ROLE } from '@/constant';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export const authentication = (setLoading, router, toastShownRef, userRole) => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    const validRole = [ROLE.ADMINISTRATOR, ROLE.DOCTOR, ROLE.ASSISTANT].includes(role);
    if (token && role) {
        if (validRole) {
            if (role !== userRole) {
                if (!toastShownRef.current) {
                    toast.error(`login as ${userRole}!`);
                    toastShownRef.current = true;
                }
                router.push('/login');
            } else {
                setLoading(false);
            }
        } else {
            Cookies.remove('token');
            Cookies.remove('role');
            Cookies.remove('name');
            if (!toastShownRef.current) {
                toast.error('something went wrong. login again!');
                toastShownRef.current = true;
            }
            router.push('/login');
        }
    } else {
        if (!toastShownRef.current) {
            toast.error('login to access the dashboard!');
            toastShownRef.current = true;
        }
        router.push('/login');
    }
};






