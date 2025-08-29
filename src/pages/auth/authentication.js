
/* eslint-disable no-useless-concat */
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { APP_PREFIX_PATH } from '../../config/AppConfig';
function Authentication() {
    const navigate = useNavigate();
    console.log('auth page enter');

    useEffect(() => {
        const path = window.location.pathname;
        const protectedPaths = [
            '/dashboard',
            APP_PREFIX_PATH + '/users',
            APP_PREFIX_PATH + '/category',
            APP_PREFIX_PATH + '/ManageSubject',
            APP_PREFIX_PATH + '/orders',
            APP_PREFIX_PATH + '/broadcast',
            APP_PREFIX_PATH + '/manage-banner',
            APP_PREFIX_PATH + '/manage-contact',
            APP_PREFIX_PATH + '/manage-content',
            APP_PREFIX_PATH + '/manage-product',
            APP_PREFIX_PATH + '/view-user/:user_id',
            APP_PREFIX_PATH + '/view-user',
            APP_PREFIX_PATH + '/edit-product/product_id',
            APP_PREFIX_PATH + '/add-product',
            APP_PREFIX_PATH + '/view-product/product_id',
            APP_PREFIX_PATH + '/view-product',
            APP_PREFIX_PATH + '/profile',
        ];

        const token = sessionStorage.getItem('token');
        const userType = sessionStorage.getItem('user_type');

        console.log('Current Path:', path);
        console.log('Token:', token);

        if (!token) {
            if (![`/${APP_PREFIX_PATH}`,`/${APP_PREFIX_PATH}` + '/', `/${APP_PREFIX_PATH}` + '/forgot-password', `/${APP_PREFIX_PATH}` + '/reset-password'].includes(path)) {
                console.log('Navigating to /');
                navigate(APP_PREFIX_PATH + '/');
            }
        } else {
            if ([`/${APP_PREFIX_PATH}`,`/${APP_PREFIX_PATH}` + '/', `/${APP_PREFIX_PATH}` + '/reset-password', `/${APP_PREFIX_PATH}` + '/forgot-password'].includes(path)) {
                console.log('Navigating to dashboard since token is present');
                navigate(`/${APP_PREFIX_PATH}` + '/dashboard');
            }

            // Check for protected paths and user type validity
            if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
                console.log('Protected path');
                if (userType !== '0' && !token) {
                    console.log('Invalid user type, navigating to /logout');
                    navigate(APP_PREFIX_PATH + '/');
                }
            }
        }
    }, [navigate]);

    return null;
}

export default Authentication;