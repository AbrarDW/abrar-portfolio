# Face Wireframe Vue App

A Vue 3 application that displays real-time face wireframe detection using MediaPipe Face Mesh.

## Features

- Real-time face detection from webcam
- Face mesh wireframe rendering (FACEMESH_TESSELATION)
- Face landmarks (points) visualization
- Toggle buttons to show/hide mesh and points
- FPS counter
- Dark theme fullscreen layout
- Responsive design

## Tech Stack

- Vue 3 (Composition API)
- Vite build tool
- MediaPipe Face Mesh (CDN)
- Canvas API for rendering

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

## Usage

1. Allow camera access when prompted
2. Face will be detected and wireframe will be rendered
3. Use toggle buttons to show/hide mesh and points
4. FPS counter shows real-time performance

## Project Structure

```
├── src/
│   ├── main.js      # Vue app entry point
│   └── App.vue      # Main component with face detection
├── index.html       # HTML template with MediaPipe CDN
├── package.json     # Dependencies
├── vite.config.js   # Vite configuration
└── README.md        # This file
```

## Browser Requirements

- Modern browser with WebGL support
- HTTPS connection (required for camera access)
- Chrome, Firefox, Safari, or Edge

## Controls

- **Show/Hide Mesh**: Toggle face wireframe visibility
- **Show/Hide Points**: Toggle landmark points visibility

## Performance

- Optimized for 30+ FPS
- Real-time rendering using requestAnimationFrame
- Efficient canvas clearing and drawing