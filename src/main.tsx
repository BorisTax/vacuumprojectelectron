import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import 'normalize.css';
import './styles/app.scss';
import './styles/buttons.scss';
import './styles/animation.scss';
import './styles/containers.scss';
import './styles/inputs.scss';
import './styles/toolbars.scss'
const container = document.getElementById('root')

createRoot(container as HTMLElement).render(<App />);

window.devicePixelRatio = 2;

