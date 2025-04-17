import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Leaflet CSS
const leafletCss = document.createElement('link');
leafletCss.rel = 'stylesheet';
leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
leafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
leafletCss.crossOrigin = '';
document.head.appendChild(leafletCss);

// Add Inter and Montserrat fonts
const fonts = document.createElement('link');
fonts.rel = 'stylesheet';
fonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@500;600;700&display=swap';
document.head.appendChild(fonts);

// Add title
const title = document.createElement('title');
title.textContent = 'Eatinery - Find Healthy Restaurants Nearby';
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
