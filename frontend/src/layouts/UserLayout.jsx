import React from "react";       
import UserNavbar from "../components/UserNavbar"; 
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <UserNavbar />    
       <div style={{ padding: "20px" }}>
        <Outlet />  
      </div>        
    </>
  );
}
