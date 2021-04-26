# ryandavidmercado.github.io
![Preview](https://raw.githubusercontent.com/ryandavidmercado/ryandavidmercado.github.io/main/screenshots/preview.gif)

Personal portfolio. Gathers pinned repositories from my GitHub profile automatically, with some swanky CSS work and personal information to sweeten the deal. Built to display my work to potential employers in a more visually pleasing manner than GitHub natively provides.

[Live Site](https://ryandavidmercado.github.io/)

## Purpose
The site was designed with three main goals in mind:
* One, to practice visual design skills and their implementation on the web
* Two, to engage in mobile-first design and practice expanding mobile designs onto the desktop, and
* Three, to ultimately create a unique, eye-grabbing visual display of my work.

## Features
* Automatic fetching of my pinned repositories and associated data
* Several JavaScript implementation details for enhancing the user experience
  * Ensuring the page is scrolled to the top on every load while still allowing internal linking
  * Scroll-lock during the intro animation to prevent "seeing behind the curtains"
* Implementation of animate-on-scroll (AOS) CSS library for a small touch of visual dynamism
* Integrated contact form

## Lessons Learned
* Organizing CSS in a single, monolithic file gets unmaintanable fast. After this project, I shifted exclusively to the use of CSS modules and alternative CSS-in-JS implementations.
* Dynamic data fetching can get very fiddly without the use of caching and/or an established framework. For more information, see "Future Goals".
* Cross-browser implementation should be a priority during the development phase. Using several features not supported in Safari - particularly flex-gap - has led to a broken presentation on MacOS.

## Tech Stack
* HTML5/CSS/JS
* Animate-on-scroll (AOS) library

## Future Goals
* Rewrite the site using Gatsby, mainly as a means of solving the issues raised in Lessons Learned. This would have several key benefits:
  * Project structure/organization: segregating the pieces of this site into components would lead to a more parsable codebase, particularly in regard to the CSS.
  * Caching: Relying on third-party services for fetching data has led to a slightly inconsistent presentation, where data sometimes fails to load and the showcase is not properly populated. Gatsby would allow me to define my data sources at build time, with changes updated in builds automatically.
  * Cross-broswer implementation: writing the app in a standard framework would allow for easier integration of polyfills and transpilation, enhancing cross-browser compatability.

