async function analyze() {
  const url = document.getElementById("urlInput").value;
  const output = document.getElementById("output");

  output.textContent = "Analyzing...";

  try {
    const result = await runAnalyzer(url);
    output.textContent = JSON.stringify(result, null, 2);
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}