
const API = "";

const serverStatus = document.getElementById("serverStatus");
const botStatus = document.getElementById("botStatus");
const uptime = document.getElementById("uptime");
const deployStatus = document.getElementById("deployStatus");
const sessionStatus = document.getElementById("sessionStatus");
const consoleBox = document.getElementById("console");

function addLog(message, type = "INFO") {
  const line = document.createElement("p");
  const time = document.createElement("span");

  time.className = "console-time";
  time.textContent = `[${type}] `;

  line.appendChild(time);
  line.appendChild(document.createTextNode(message));

  consoleBox.appendChild(line);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

async function checkStatus() {
  try {
    const response = await fetch(`${API}/api/status`);

    if (!response.ok) {
      throw new Error("Server returned an error");
    }

    const data = await response.json();

    serverStatus.textContent = data.status || "Online";
    uptime.textContent = data.uptime || "--";
    botStatus.textContent = data.botStatus || "Not connected";
    deployStatus.textContent = data.deployment || "Not configured";
    sessionStatus.textContent = data.botStatus || "Not connected";

    addLog("Server health check completed successfully.");
  } catch (error) {
    serverStatus.textContent = "Offline";
    botStatus.textContent = "Not connected";
    uptime.textContent = "--";

    addLog("Unable to connect to the server API.", "ERROR");
  }
}

document.getElementById("connectGithub").addEventListener("click", () => {
  addLog("GitHub integration is not configured yet.", "INFO");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});

checkStatus();

setInterval(checkStatus, 30000);
