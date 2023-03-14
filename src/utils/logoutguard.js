import { checkJWT } from './api';
// User should be logged out to access this page, otherwise redirect to dashboard
function logoutGuard(navigate) {
    function navigator() {
        if (checkJWT()) {
            navigate('/');
        }
    }
    return navigator;
}

export default logoutGuard;