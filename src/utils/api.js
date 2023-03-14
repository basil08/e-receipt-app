import { Navigate } from "react-router-dom";

const GOONJ_APP_JWT_KEY = 'GOONJ_APP_JWT';
const BASE_URL = 'http://localhost:8080/';

const setJWT = (jwt) => window.localStorage.setItem(GOONJ_APP_JWT_KEY, jwt);
const getJWT = () => window.localStorage.getItem(GOONJ_APP_JWT_KEY);
const delJWT = () => window.localStorage.removeItem(GOONJ_APP_JWT_KEY);

async function logout() {
  delJWT();
  window.location.href = '/login';
}

async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}auth/loginUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  console.log(res.status);
  if (res.status === 201) {
    const data = await res.json();
    setJWT(data['access_token']);
    return { error: false, message: res.data };
  } else if (res.status === 401) {
    return { error: true, message: "User unauthorized" };
  } else {
    return { error: true, message: res.error };
  }
}

function checkJWT() {
  return getJWT() != null;
}

async function getUserProfile() {
  const res = await fetch(`${BASE_URL}auth/userProfile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getJWT()}`
    }
  });

  const data = await res.json();
  console.log(data);
  if (res.status === 200) {

    return { error: false, message: data };
  } else if (res.status === 401) {
    return { error: true, message: "User unauthorized" };
  } else {
    return { error: true, message: res.error };
  }
  
}

async function getEmailTemplates(skip=0, limit=0) {
  const res = await fetch(`${BASE_URL}api/getEmailTemplates?skip=${skip}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getJWT()}`
    }
  });
  const data = await res.json();
  if (res.status === 200) {
  
    return { error: false, message: data };
  } else if (res.status === 401) {
    return { error: true, message: "User unauthorized" };
  } else {
    return { error: true, message: res.error };
  }
}

async function deleteTemplate(id) {
  const res = await fetch(`${BASE_URL}api/deleteEmailTemplate?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getJWT()}`
    }
  });
  const data = await res.json();
  if (res.status === 200) {
    return { error: false, message: data };
  } else if (res.status === 401) {
    return { error: true, message: "User unauthorized" };
  } else {
    return { error: true, message: res.error };
  }
}

async function createNewEmailTemplate(name, body) {
  const res = await fetch(`${BASE_URL}api/createEmailTemplate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await res.json();

  if (res.status === 200) {
    return { error: false, message: data };
  } else if (res.status === 401) {
    return { error: true, message: "User unauthorized" };
  } else {
    return { error: true, message: res.error };
  }
}
export { checkJWT, logout, loginUser, getUserProfile, getEmailTemplates, deleteTemplate, createNewEmailTemplate };