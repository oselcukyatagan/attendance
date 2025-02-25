import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './Pages/LoginPage';
import AddClassPage from './Pages/AddClassPage';
import MainPage from './Pages/MainPage';
import SignUpPage from './Pages/SignUpPage';

function App() {
  return (
    <Router basename="/attendance">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/add" element={<AddClassPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path='/signUp' element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
