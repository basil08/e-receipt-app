const GOONJ_APP_JWT_KEY = 'GOONJ_APP_JWT';
const BASE_URL = 'http://localhost:8080/';

const setJWT = (jwt) => window.localStorage.setItem(GOONJ_APP_JWT_KEY, jwt);
const getJWT = () => window.localStorage.getItem(GOONJ_APP_JWT_KEY);
const delJWT = () => window.localStorage.setItem(GOONJ_APP_JWT_KEY, null);

async function logout() {
  delJWT();
}

async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}auth/loginUser`, {
    method: 'POST',
    body: JSON.stringify({ email: email, password: password })
  });

  if (res.statusCode === 201) {
    console.log("ACCESS TOKEN", res['access_token']);
    setJWT(res['access_token']);
    return { error: false, message: res.data };
  } else if (res.statuscode === 401) {
    return { error: true, message: "User unauthorized" };
  } else {
    return { error: true, message: res.error };
  }
}

async function checkJWT() {
  return getJWT() != null;
}

export { checkJWT, logout, loginUser };