# Anigraph UI App

A single page application using @demee/anigraph-ui, built with webpack and ready for GitHub Pages deployment.

## Prerequisites

- Node.js (v14 or higher)
- npm
- GitHub personal access token with `read:packages` permission

## Setup

### 1. Configure GitHub npm registry authentication

Create or update `.npmrc` file in the project root with your GitHub token:

```bash
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc
```

Replace `YOUR_GITHUB_TOKEN` with your actual GitHub personal access token.

### 2. Install dependencies

```bash
npm install
```

This will install:
- Webpack and related build tools
- @demee/anigraph-ui@1.0.1

## Development

### Run development server

```bash
npm run serve
```

This will start a development server at `http://localhost:9000` with hot module replacement.

### Watch mode

```bash
npm run dev
```

This will watch for file changes and rebuild automatically.

## Production Build

Build the application for production:

```bash
npm run build
```

This creates an optimized bundle in the `dist/` directory.

## Deploying to GitHub Pages

### Option 1: Manual deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Push the `dist` folder to the `gh-pages` branch:
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

### Option 2: Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Configure npm for GitHub Packages
        run: |
          echo "@demee:registry=https://npm.pkg.github.com" >> .npmrc
          echo "//npm.pkg.github.com/:_authToken=\${{ secrets.GITHUB_TOKEN }}" >> .npmrc

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Configure GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "gh-pages" branch
4. Your site will be available at `https://<username>.github.io/<repository>/`

## Project Structure

```
.
├── src/
│   ├── index.html      # HTML template
│   ├── index.js        # Main entry point
│   └── styles.css      # Global styles
├── dist/               # Production build output (generated)
├── webpack.config.js   # Webpack configuration
├── package.json        # Project dependencies and scripts
└── .npmrc             # npm registry configuration
```

## Next Steps

1. Authenticate with GitHub npm registry (see Setup section)
2. Install @demee/anigraph-ui package
3. Uncomment the import statement in `src/index.js`
4. Implement your application using Anigraph UI components
5. Build and deploy to GitHub Pages

## License

MIT
