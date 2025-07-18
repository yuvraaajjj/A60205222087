import React, { useState } from 'react';

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function ShortenerForm({ onSuccess, onError }) {
  const [inputList, setInputList] = useState([{ url: '', validity: 30, shortcode: '' }]);

  const handleInputChange = (idx, name, value) => {
    const list = [...inputList];
    list[idx][name] = value;
    setInputList(list);
  };

  const handleAdd = () => {
    if (inputList.length < 5) {
      setInputList([...inputList, { url: '', validity: 30, shortcode: '' }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let entry of inputList) {
      if (!isValidUrl(entry.url)) {
        onError(`Invalid URL: ${entry.url}`);
        return;
      }
      if (entry.validity && isNaN(Number(entry.validity))) {
        onError('Validity must be an integer.');
        return;
      }
    }

    await Promise.all(
      inputList.map(async (entry) => {
        try {
          const res = await fetch('http://localhost:3001/shorturls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: entry.url,
              validity: entry.validity,
              shortcode: entry.shortcode || undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Unknown error');
          onSuccess({ ...entry, shortLink: data.shortLink, expiry: data.expiry });
        } catch (err) {
          onError(err.message);
        }
      })
    );
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">Shorten Your URL</h2>

        {inputList.map((input, idx) => (
          <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="url"
              placeholder="Enter long URL"
              value={input.url}
              onChange={(e) => handleInputChange(idx, 'url', e.target.value)}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Validity (min)"
              min={1}
              max={1440}
              value={input.validity}
              onChange={(e) => handleInputChange(idx, 'validity', e.target.value)}
              className="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Shortcode (optional)"
              value={input.shortcode}
              onChange={(e) => handleInputChange(idx, 'shortcode', e.target.value)}
              className="w-52 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Shorten URL{inputList.length > 1 && 's'}
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={inputList.length >= 5}
            className={`px-6 py-2 border rounded-lg ${
              inputList.length >= 5
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            Add Another
          </button>
        </div>
      </form>
    </div>
  );
}

export default ShortenerForm;
