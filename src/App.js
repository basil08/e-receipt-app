import { Route, BrowserRouter, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailTemplates from "./pages/EmailTemplates";

import "./App.css";
import "./custom.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />} />
        <Route path='/templates' element={<EmailTemplates />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
