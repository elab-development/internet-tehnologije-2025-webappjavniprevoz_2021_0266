'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false, 
  loading: () => <p>Učitavam zaštićenu dokumentaciju...</p>
});

export default function AdminApiDocs() {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'black', marginBottom: '20px' }}>Admin API Panel</h1>
    
    <SwaggerUI 
        url="/api/swagger" 
        docExpansion="list"
        defaultModelExpandDepth={5}
        requestInterceptor={(req) => {
        req.credentials = 'include'; // KLJUČNA LINIJA: Šalje tvoj 'auth' cookie sa svakim klikom
        return req;
        }}></SwaggerUI>
        </div>
    
  );
}