const API_URL = "https://example-api.com/download"; 
// 🔥 REEMPLAZA con una API real (RapidAPI, etc)

function isValidURL(url) {
  return url.includes("youtube.com") ||
         url.includes("youtu.be") ||
         url.includes("tiktok.com") ||
         url.includes("facebook.com");
}

async function convertVideo() {
  const url = document.getElementById("urlInput").value;
  const loader = document.getElementById("loader");
  const result = document.getElementById("result");
  const errorBox = document.getElementById("error");

  result.classList.add("hidden");
  errorBox.classList.add("hidden");

  if (!isValidURL(url)) {
    showError("⚠️ Enlace no válido");
    return;
  }

  loader.classList.remove("hidden");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    loader.classList.add("hidden");

    if (!data.success) {
      showError("❌ No se pudo procesar el video");
      return;
    }

    showResult(data);

  } catch (err) {
    loader.classList.add("hidden");
    showError("🚫 Error al conectar con la API");
  }
}

function showResult(data) {
  document.getElementById("thumbnail").src = data.thumbnail;
  document.getElementById("title").innerText = data.title;

  const videoOptions = document.getElementById("videoOptions");
  const audioOptions = document.getElementById("audioOptions");

  videoOptions.innerHTML = "";
  audioOptions.innerHTML = "";

  data.videoFormats.forEach(v => {
    const btn = document.createElement("button");
    btn.innerText = `MP4 ${v.quality}`;
    btn.onclick = () => window.open(v.url);
    videoOptions.appendChild(btn);
  });

  data.audioFormats.forEach(a => {
    const btn = document.createElement("button");
    btn.innerText = `MP3 ${a.quality}`;
    btn.onclick = () => window.open(a.url);
    audioOptions.appendChild(btn);
  });

  document.getElementById("result").classList.remove("hidden");
}

function showError(msg) {
  const errorBox = document.getElementById("error");
  errorBox.innerText = msg;
  errorBox.classList.remove("hidden");
}
