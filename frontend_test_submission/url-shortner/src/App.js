import React, { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

const LinkShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl })
      });
      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError('An error occurred while shortening the URL');
    }
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>URL Shortener</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter long URL"
            required
          />
          <Button type="submit" className="mt-2 w-full">Shorten</Button>
        </form>
      </CardContent>
      <CardFooter>
        {shortUrl && (
          <Alert>
            <AlertDescription>
              Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};
export default LinkShortener;