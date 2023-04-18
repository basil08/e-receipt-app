
const DEBUG = false;

const GOONJ_APP_JWT_KEY = 'GOONJ_APP_JWT';
const BASE_URL = DEBUG ? 'http://localhost:8080/' : 'https://goonj-receipts-backend.vercel.app/';

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

async function getEmailTemplates(skip = 0, limit = 0) {
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

async function getTemplateNames() {
  const res = await fetch(`${BASE_URL}api/getTemplateNames`, {
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
    },
    body: JSON.stringify({ name, body })
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

async function generateReceipts(csvData) {
  
  const res = await fetch(`${BASE_URL}api/generateReceipts `, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ csvData })
  });

  const data = await res.json();
  
  if (res.status === 201) {
    return { error: false, message: data };
  } else if (res.status === 401) {
    return { error: true, message: "User unauthorized" };
  } else {
    return { error: true, message: res.error };
  }
}

async function sendReceipts(csvData, defaultTemplate) {
  
  const res = await fetch(`${BASE_URL}api/sendReceipts `, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ csvData, defaultTemplate })
  });

  const data = await res.json();
  
  if (res.status === 201) {
    return { error: false, code: 0, message: data };
  } else if (res.status === 401) {
    return { error: true, code: 1, message: "User unauthorized" };
  } else if (res.status === 400 ) {
    return { error: true, code: -1, message: data.message };
    // return { error: true, message: res.error };
  }
}

async function clearCache() {
  
  const res = await fetch(`${BASE_URL}api/clearCache `, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
    },
  });

  const data = await res.json();
  
  if (res.status === 200) {
    return { error: false, code: 0, message: data.filesCleared };
  } else if (res.status === 401) {
    return { error: true, code: 1, message: "User unauthorized" };
  } else if (res.status === 400 ) {
    return { error: true, code: -1, message: data.message };
  }
}

async function getZip() {
  const res = await fetch(`${BASE_URL}api/getZip `, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
    },
  });
  return res;
}

async function downloadLogFile() {
  const res = await fetch(`${BASE_URL}api/getLog `, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
    },
  });
  return res;
}

async function downloadErrorFile() {
  const res = await fetch(`${BASE_URL}api/getError `, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
    },
  });
  return res;
}

export { checkJWT, logout, loginUser, getUserProfile, downloadLogFile, downloadErrorFile, getEmailTemplates, getZip, deleteTemplate, createNewEmailTemplate, getTemplateNames, generateReceipts, sendReceipts, clearCache };