import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkJWT } from "../utils/api";
import { logout } from "../utils/api";

import { getUserProfile } from "../utils/api";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  
  useEffect(() => {
    getUserProfile().then((user) => {
      setUser(user);
    });
  }, [])

  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="https://goonj.org">
          Goonj
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">
                Sender
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/templates">
                Templates
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page"  target="_blank" href="https://docs.google.com/document/d/1XIwYdY738Wrn4jePIfiRu-2GxrXyBMNtJ6mrLyLArRw/edit?hl=en">
                Manual
              </a>
            </li>
          </ul>

          <div className="d-flex">
            {checkJWT() !== false ? (

              <button class="btn btn-primary" onClick={() => logout()}>
                Logout
              </button>
              // <div className="dropdown">
              //   <button
              //     class="btn btn-secondary dropdown-toggle"
              //     href="#"
              //     id="navbarDropdown2"
              //     type="button"
              //     data-bs-toggle="dropdown"
              //     aria-expanded="false"
              //   >
              //     {user ? user.email : 'Loading...'}
              //   </button>
              //   <ul class="dropdown-menu" aria-labelledby="navbarDropdown2">
              //     <li>

              //     </li>
              //   </ul>
              // </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div>

          {/* <form class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form> */}
        </div>
      </div>
    </nav>
  );
}
