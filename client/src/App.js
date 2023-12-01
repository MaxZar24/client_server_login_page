import React from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./Home";
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/' element={<SignUp /> }></Route>
                <Route path='/home' element={<Home /> }></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App