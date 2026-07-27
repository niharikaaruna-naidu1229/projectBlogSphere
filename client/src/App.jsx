import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./context/AuthContext";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import AdminUsers from "./pages/AdminUsers";



function App(){

return (

<AuthProvider>

<BrowserRouter>

<Routes>

<Route path="/" element={<Home/>}/>

<Route path="/login" element={<Login/>}/>

<Route path="/register" element={<Register/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/create-post" element={<CreatePost/>}/>

<Route path="/posts/:id" element={<PostDetails/>}/>

<Route path="/admin/users" element={<AdminUsers/>}/>

</Routes>

</BrowserRouter>

</AuthProvider>

);

}


export default App;