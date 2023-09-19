import React from 'react';
import type {HeadFC, PageProps} from 'gatsby';
import {StaticImage} from 'gatsby-plugin-image';
import {headerStyle} from "../styles/index.css";

const pageStyles = {
    color: '#232129',
    padding: 96,
    fontFamily: '-apple-system, Roboto, sans-serif, serif',
};

const IndexPage: React.FC<PageProps> = () => (
    <>
        <header className={headerStyle}>
            <a href="">Blog</a>
            <a href="">Software</a>
            <StaticImage src="../images/logo.jpg" width={100} alt="d"/>
            <a href="">About</a>
            <a href="">Contact</a>
        </header>
        <main style={pageStyles}>

        </main>
        <footer></footer>
    </>
);

export default IndexPage;

export const Head: HeadFC = () => (
    <>
        <title>demee.org</title>
        <link rel="icon" type="image/x-icon" href="../images/favicon.ico"/>
    </>
);
