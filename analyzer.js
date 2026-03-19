async function runAnalyzer(url) {
  const logs = [];

  // intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const start = performance.now();

    try {
      const response = await originalFetch(...args);
      const duration = performance.now() - start;

      logs.push({
        url: args[0],
        status: response.status,
        success: response.ok,
        duration
      });

      return response;
    } catch (error) {
      logs.push({
        url: args[0],
        status: "FAILED",
        error: error.message
      });
      throw error;
    }
  };

  // 🔥 ADD TEST CALLS HERE
  await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=Manila&key=AIzaSyAwWUieKcOcGvkXn-P9CXvdZdDgmsI_1Go");       // success
  await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=Manila");     // 404
  await fetch(url);                                                // your input

  await new Promise(r => setTimeout(r, 2000));

  return summarizeLogs(logs);
}