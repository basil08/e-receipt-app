import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { loginUser } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async () => {
    const res = await loginUser(email, password);

    if (!res.error) {
      console.log("User logged in!");
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
          />
        </div>
        <div class="my-3">
          <label for="passwordField" class="form-label">
            Password
          </label>
          <input type="password" class="form-control" id="passwordField" />
        </div>

        <div class="my-3 row justify-content-center">
          <button class="btn btn-primary" onClick={() => handleLoginSubmit()}>Submit</button>
        </div>
      </Layout>
    </>
  );
}
