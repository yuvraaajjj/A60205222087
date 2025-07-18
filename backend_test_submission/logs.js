async function log(stack, level, pkg, message) {
  const payload = {
    stack: stack,
    level: level,
    package: pkg,
    message: message,
  };

  try {
    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      console.error('Logging failed:', await response.text());
    }
  } catch (error) {
    console.error('Network error while logging:', error);
  }
}

module.exports = log;