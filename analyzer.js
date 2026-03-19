async function runAnalyzer(url) {
  const logs = [];

  // interceptors here...

  alert("Now trigger API calls manually (click button in test page)");

  await new Promise(r => setTimeout(r, 5000));

  return summarizeLogs(logs);
}