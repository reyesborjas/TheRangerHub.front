import React from "react";
import Blog from "./dashboard/Blog";
import MyNavbar from "../components/Navbar.jsx";



function BlogHome() {
  return (
    <>
      <MyNavbar />
      <Blog></Blog>
    </>
  );
}

export default BlogHome;
