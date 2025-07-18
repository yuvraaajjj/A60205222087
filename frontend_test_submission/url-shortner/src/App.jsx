import React, { useState } from 'react';
import ShortenerForm from './ShortnerForm';
import UrlList from './url';

function App() {
  const [shortUrls, setShortUrls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUrlCreated = (result) => {
    setShortUrls([result, ...shortUrls]);
    setSuccess('URL shortened successfully!');
  };

  const handleError = (msg) => {
    setError(msg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 relative">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">🔗 URL Shortener</h1>

        <ShortenerForm onSuccess={handleUrlCreated} onError={handleError} />

        <div className="mt-10">
          <UrlList urls={shortUrls} />
        </div>

        {error && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative shadow-lg animate-fade-in"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button onClick={() => setError('')} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <span className="text-red-700 text-lg font-bold">&times;</span>
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative shadow-lg animate-fade-in"
              role="alert"
            >
              <strong className="font-bold">Success: </strong>
              <span className="block sm:inline">{success}</span>
              <button onClick={() => setSuccess('')} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <span className="text-green-700 text-lg font-bold">&times;</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
