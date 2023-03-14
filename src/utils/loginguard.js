import { checkJWT } from './api';
// User should be logged in to access this page, otherwise redirect to login
function loginGuard(navigate) {
    function navigator() {
        if (!checkJWT()) {
            navigate('/login');
        }
    }
    return navigator;
}

export default loginGuard;