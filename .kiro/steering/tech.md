# Technology Stack

## Core Technologies

- **HTML5**: Semantic markup with accessibility attributes
- **CSS3**: Custom styling (no framework)
- **Vanilla JavaScript (ES6+)**: No build tools or transpilation required
- **Chart.js**: Data visualization library (loaded via CDN)

## Architecture

- **Client-side only**: No backend server or API
- **Static hosting**: Can be served from any web server or opened directly in browser
- **Local Storage API**: Browser-based persistence layer

## Build System

**No build system required** - this is a static web application.

### Development

Simply open `index.html` in a browser

### Testing

No automated test suite currently exists. Manual testing in browser required.

### Deployment

Deploy the entire directory to any static hosting service (GitHub Pages, Netlify, Vercel, etc.) or web server.

## Browser Compatibility

Requires modern browser with support for:
- ES6+ JavaScript features (arrow functions, template literals, const/let)
- Local Storage API
- Canvas API (for Chart.js)
