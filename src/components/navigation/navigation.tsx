import React from 'react';
import { Link } from 'gatsby';
import * as styles from '../../styles/navigation.module.scss';

const Navigation = () => (
  <>
  <header style={{ display: 'flex', alignItems: 'center' }}>
    <h1 style={{ marginRight: 'auto' }}>demee.org</h1>
    <nav>
      <Link className={styles.link} to="/">Home</Link>
      <Link className='link' to="/blog">Blog</Link>
      <Link className='link' to="/projects">Projects</Link>
      <Link className='link' to="/about">About</Link>
    </nav>
  </header>
  <hr />
  </>
);

export default Navigation;
