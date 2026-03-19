function summarizeLogs(logs) {
  const summary = {
    totalRequests: logs.length,
    failedRequests: 0,
    slowRequests: [],
    errors: []
  };

  logs.forEach(log => {
    if (!log.success) {
      summary.failedRequests++;
      summary.errors.push(log);
    }

    if (log.duration && log.duration > 1000) {
      summary.slowRequests.push(log);
    }
  });

  return summary;
}