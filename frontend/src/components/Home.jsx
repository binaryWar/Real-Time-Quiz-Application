import { useState } from "react";
import { Navigate, Outlet,Link } from "react-router-dom";

const Home = ()=>{
    return (
        <>
        <h1>Welcome to Quiz App</h1>
        <nav>
        <ul>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          <li>
            <Link to="/user">Users</Link>
          </li>
        </ul>
      </nav>
      <Outlet/>
    </>
    )
}
export default Home;