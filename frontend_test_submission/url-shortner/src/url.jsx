import React, { useState } from 'react';

function UrlList({ urls }) {
  const [openStats, setOpenStats] = useState({});
  const [statsData, setStatsData] = useState({});

  const handleToggleStats = (idx) => {
    setOpenStats((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleFetchStats = async (url, idx) => {
    try {
      const code = url.shortLink.split('/').pop();
      const res = await fetch(`http://localhost:3001/shorturls/${code}/stats`);
      const data = await res.json();
      setStatsData((prev) => ({ ...prev, [idx]: data }));
    } catch {
      setStatsData((prev) => ({
        ...prev,
        [idx]: { error: 'Error fetching stats' },
      }));
    }
    handleToggleStats(idx);
  };

  return (
    <div className="space-y-4">
      {urls.map((url, idx) => (
        <div
          key={idx}
          className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="text-gray-800 space-y-1">
              <p>
                <span className="font-semibold">Original:</span>{' '}
                <a
                  href={url.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {url.url}
                </a>
              </p>
              <p>
                <span className="font-semibold">Short URL:</span>{' '}
                <a
                    href={`http://localhost:3001/${url.shortLink.split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                    >
                    {`http://localhost:3001/${url.shortLink.split('/').pop()}`}
                </a>
              </p>
              <p>
                <span className="font-semibold">Expiry:</span> {url.expiry}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleFetchStats(url, idx)}
                className="border border-blue-500 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
              >
                {openStats[idx] ? 'Hide Stats' : 'Show Stats'}
              </button>
            </div>
          </div>

          {openStats[idx] && (
            <div className="mt-4 border-t pt-4 text-sm text-gray-700">
              {statsData[idx] ? (
                statsData[idx].error ? (
                  <p className="text-red-500">{statsData[idx].error}</p>
                ) : (
                  <div>
                    <p className="mb-2">
                      <span className="font-semibold">Total Clicks:</span>{' '}
                      {statsData[idx].total_clicks}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {(statsData[idx].clicks || []).map((click, i) => (
                        <li key={i}>
                          Time: {click.time} | Referrer: {click.referrer || 'N/A'} | IP:{' '}
                          {click.ip || 'N/A'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ) : (
                <p className="italic text-gray-500">Fetching...</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UrlList;
