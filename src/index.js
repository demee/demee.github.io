// Import styles
import './styles.css';

// Import anigraph-ui once authentication is set up
// Uncomment the following line after installing @demee/anigraph-ui
// import * as Anigraph from '@demee/anigraph-ui';

console.log('Application initialized');

// Get the app container
const appContainer = document.getElementById('app');

// Example: Create a simple welcome message
// Replace this with your actual anigraph-ui implementation
function initApp() {
  appContainer.innerHTML = `
    <div class="container">
      <h1>Welcome to Anigraph UI App</h1>
      <p>This is a single page application built with webpack.</p>
      <p><strong>Next steps:</strong></p>
      <ol>
        <li>Authenticate with GitHub npm registry</li>
        <li>Install @demee/anigraph-ui@1.0.1</li>
        <li>Import and use the Anigraph components in this file</li>
      </ol>
    </div>
  `;
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Example of how you might use anigraph-ui after installation:
// const graph = new Anigraph.Graph();
// graph.init(appContainer);
