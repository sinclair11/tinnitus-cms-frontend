import React from 'react';
import '@src/app.sass';
import Router from '@src/router/router';
import { initInterceptorHandler } from '@src/handlers/interceptor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const App: React.FC<{ title: string; version: string }> = (props: { title: string; version: string }) => {
    initInterceptorHandler();
    return <Router />;
};

export default App;
