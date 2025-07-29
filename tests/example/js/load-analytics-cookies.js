fetch('../integration/data/cookies/analytics-cookies.json')
  .then((response) => response.json())
  .then((cookieNames) => {
    const now = new Date();
    now.setTime(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const expires = `expires=${now.toUTCString()}; path=/`;

    cookieNames.forEach((name) => {
      const value = encodeURIComponent(`${name}-value`);
      document.cookie = `${name}=${value}; ${expires}`;
    });
  })
  .catch((err) => {
    console.error('Failed to load analytics cookies:', err);
  });
