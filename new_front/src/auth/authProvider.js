


let isAuth = false;
let user = null;

async function checkAuth() {
    try {
        const res = await axios.get('https://localhost:443/api/accounts/auth/');
        if (res.status === 200) {
            isAuth = true;
            user = JSON.parse(localStorage.getItem('user'));
        }
    } catch {
        isAuth = false;
    }
    return isAuth;
}

function login(userData, access_token, refresh_token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    isAuth = true;
    user = userData;
    window.location.href = '/';
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    isAuth = false;
    user = null;
    window.location.href = '/login';
}

function getUser() {
    return user;
}

function getAuthStatus() {
    return isAuth;
}

export { checkAuth, login, logout, getUser, getAuthStatus };