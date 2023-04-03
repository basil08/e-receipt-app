import { useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";

export default function Signup() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSignupSubmit = () => {
    
    
    
    
  }
  
  
  return (
    <>
    <Header />
    <Layout>
        <div class="fw-bol fs-4">Signup</div>

        <div class="my-3">
          <label for="emailField" class="form-label">
            Username
          </label>
          <input
            type="text"
            class="form-control"
            id="username"
            placeholder="admin@goonj.org"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
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
          <button class="btn btn-primary" onClick={() => handleSignupSubmit()}>Submit</button>
        </div>
      </Layout>

    </>
  )
}