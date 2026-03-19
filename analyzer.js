async function runAnalyzer(url) {
  const logs = [];

  // Intercept fetch
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

  // Intercept XHR
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url;
    return originalOpen.apply(this, arguments);
  };

  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    const start = performance.now();

    this.addEventListener("loadend", () => {
      const duration = performance.now() - start;

      logs.push({
        url: this._url,
        status: this.status,
        success: this.status >= 200 && this.status < 300,
        duration
      });
    });

    return originalSend.apply(this, arguments);
  };

  // Load the target URL (basic simulation)
  window.open(url, "_blank");

  // Wait for logs to populate
  await new Promise(r => setTimeout(r, 3000));

  return summarizeLogs(logs);
}