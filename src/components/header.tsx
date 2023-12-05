import React from "react"
import { Link } from "gatsby"

const Header = () => (
  <header>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/projects">Projects</Link>
    </nav>
  </header>
)

export default Header
