import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import FkeyProvider from './fkeyprovider';

const root = createRoot(
    document.getElementById('react-root')
);

root.render(<FkeyProvider>
    <App />
</FkeyProvider>);