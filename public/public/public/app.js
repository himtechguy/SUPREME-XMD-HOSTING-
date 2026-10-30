
const serverStatus = document.getElementById("serverStatus");
const botStatus = document.getElementById("botStatus");
const uptimeDisplay = document.getElementById("uptime");
const deployStatus = document.getElementById("deployStatus");
const sessionStatus = document.getElementById("sessionStatus");
const consoleBox = document.getElementById("console");

let uptimeSeconds = 0;

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

function addLog(message, type = "INFO") {
  const line = document.createElement("p");
  const time = new Date().toLocaleTimeString();

  const label = document.createElement("span");
  label.className = "console-time";
  label.textContent = `[${type} ${time}] `;

  line.appendChild(label);
  line.appendChild(document.createTextNode(message));

  consoleBox.prepend(line);

  while (consoleBox.children.length > 30) {
    consoleBox.removeChild(consoleBox.lastElementChild);
  }
}

async function checkServer() {
  try {
    const response = await fetch("/api/health", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();

    serverStatus.textContent = data.server === "online"
      ? "Online"
      : "Offline";

    serverStatus.style.color = data.server === "online"
      ? "var(--green)"
      : "var(--pink)";

    uptimeSeconds = Number(data.uptimeSeconds) || 0;
    uptimeDisplay.textContent = formatUptime(uptimeSeconds);

    botStatus.textContent = data.botIntegrationConfigured
      ? data.bot
      : "Not connected";

    deployStatus.textContent = "Not configured";
    sessionStatus.textContent = "Not connected";

    addLog("Server health check successful.", "SUCCESS");
  } catch (error) {
    serverStatus.textContent = "Unavailable";
    serverStatus.style.color = "var(--pink)";
    uptimeDisplay.textContent = "--";

    addLog(`Health check failed: ${error.message}`, "ERROR");
  }
}

setInterval(() => {
  if (serverStatus.textContent === "Online") {
    uptimeSeconds++;
    uptimeDisplay.textContent = formatUptime(uptimeSeconds);
  }
}, 1000);

checkServer();
setInterval(checkServer, 30000);

addLog("SUPREME XMD dashboard initialized.");
