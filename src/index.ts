// Import styles
import './styles.css';

import { Renderer, String, SimpleFont } from '@demee/anigraph-ui';

const MARGIN = 12;

function initApp(): void {
  console.log('Initializing app');
  const renderer = new Renderer({
    pixelSize: 2,
    pixelSpacing: 1,
  });
  renderer.addElement(new String('demee.org', MARGIN, MARGIN, new SimpleFont()));
  renderer.animate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
