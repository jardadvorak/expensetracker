// This imports the StrictMode component from React, which helps identify potential problems in your application
import { StrictMode } from 'react'

// This imports the createRoot function from react-dom/client, which is used to render React components into the DOM
// DOM stands for Document Object Model - it's the structure of your webpage
import { createRoot } from 'react-dom/client'

// This imports your main App component from a file called App.jsx in the same directory
// The .jsx extension indicates this is a React component file
import App from './App.jsx'

// This imports CSS styles from index.css in the same directory
// These styles will be applied to your application
import './index.css'

// This line does several things:
// 1. document.getElementById('root') finds an HTML element with id="root" in your webpage
// 2. createRoot() creates a React root container in that element
// 3. .render() tells React what to display in that container
createRoot(document.getElementById('root')).render(
  // StrictMode is a wrapper that helps you write better React code
  // It doesn't render anything visible but helps identify potential problems during development
  <StrictMode>
    // This is your main App component that contains all other components of your application
    <App />
  </StrictMode>,
)