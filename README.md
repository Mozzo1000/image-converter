<a id="readme-top"></a>

<br />
<div align="center">
  <img src="./public/icon.svg" alt="image-converter logo" width="64" height="64">

  <h3 align="center">image-converter</h3>

  <p align="center">
    A fast, private, in-browser image format converter.
    <br />
    <a href="https://converter.rewake.org/"><strong>Visit the site »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Mozzo1000/image-converter/issues/new">Report an issue</a>
  </p>
</div>

This repository is a client-side tool for converting images between PNG, JPEG, and WEBP formats, entirely in the browser — no files are ever uploaded to a server.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#technical-architecture">Technical Architecture</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#build-for-production">Build for Production</a></li>
      </ul>
    </li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

The project is designed to be a simple, no-nonsense way to batch-convert images between common formats without giving up privacy — every conversion happens locally on-device via the Canvas API.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

* **Batch Conversion**: Drop in multiple files at once and convert the whole queue in one go.
* **Format Support**: Convert between PNG, JPEG, and WEBP.
* **Fully Client-Side**: Images never leave the browser — nothing is uploaded to a server.
* **Dark Mode**: Native support for system preferences and manual toggles.
* **Mobile Friendly**: Dedicated mobile actions bar for smaller screens.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Technical Architecture

This is a **static site** built with a focus on speed and simplicity.

* **Framework**: [Preact](https://preactjs.com/) for a tiny footprint and fast hydration.
* **Bundler**: [Vite](https://vitejs.dev/) for lightning-fast builds and Hot Module Replacement.
* **Routing/SSR**: [preact-iso](https://github.com/preactjs/preact-iso) for prerendering static HTML.
* **Icons**: [Lucide-Preact](https://lucide.dev/) for a consistent, lightweight icon set.

Image conversion is performed with the browser's native `Canvas` API — files are drawn to a canvas and re-encoded to the target MIME type, with no server round-trip involved.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

* **Node.js**: Version 24 or higher
* **npm**

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Mozzo1000/image-converter.git
   cd image-converter
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

The site will be available at `http://localhost:5173`.

### Build for Production

To generate the static files for deployment:

```sh
npm run build
```

The output will be located in the `/dist` folder. Use `npm run preview` to serve the production build locally at `http://localhost:4173`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Testing

End-to-end tests are written with [Playwright](https://playwright.dev/).

```sh
npm run test:e2e
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are highly encouraged! Please feel free to open an issue or submit a pull request.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

This project is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
