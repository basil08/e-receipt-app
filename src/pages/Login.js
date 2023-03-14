import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { getUserProfile, loginUser } from "../utils/api";
import logoutGuard from "../utils/logoutguard";

export default function Login() {
  useEffect(logoutGuard(useNavigate()), []);
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async () => {
    const res = await loginUser(email, password);

    if (!res.error) {
      navigate('/');
    } else {
      window.alert(res.message);
    }
  }

  return (
    <>
      <Header />
      <Layout>
        <div class="fw-bol fs-4">Login</div>

        <div class="my-3">
          <label for="emailField" class="form-label">
            Email
          </label>
          <input
            type="text"
            class="form-control"
            id="emailField"
            placeholder="admin@goonj.org"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="my-3">
          <label for="passwordField" class="form-label">
            Password
          </label>
          <input type="password" class="form-control" id="passwordField" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div class="my-3 row justify-content-center">
          <button class="btn btn-primary" onClick={() => handleLoginSubmit()}>Submit</button>
        </div>
      </Layout>
    </>
  );
}
