import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urls = JSON.parse(localStorage.getItem('shortened_urls') || '[]');
    const urlEntry = urls.find(u => u.shortcode === shortcode);

    if (!urlEntry) {
      alert('URL not found');
      navigate('/');
      return;
    }

    const now = new Date();
    if (now > new Date(urlEntry.expiresAt)) {
      alert('This short URL has expired');
      navigate('/');
      return;
    }

    const clickData = {
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      location: 'Unknown',
    };

    const updatedUrls = urls.map(u =>
      u.shortcode === shortcode
        ? {
            ...u,
            clicks: u.clicks + 1,
            clickData: [...u.clickData, clickData],
          }
        : u
    );

    localStorage.setItem('shortened_urls', JSON.stringify(updatedUrls));

    let targetUrl = urlEntry.originalUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    window.location.replace(targetUrl);
  }, [shortcode, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <p>Redirecting...</p>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        animation: 'spin 1s linear infinite',
        margin: '20px auto'
      }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RedirectHandler;
