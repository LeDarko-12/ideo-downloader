const API_KEY = "AQUI_TU_NUEVA_API_KEY";

// Detectar plataforma
function detectPlatform(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return null;
}

async function convertVideo() {
  const url = document.getElementById("urlInput").value;
  const loader = document.getElementById("loader");

  resetUI();

  if (!detectPlatform(url)) {
    showError("Solo se permite YouTube por ahora");
    return;
  }

  loader.classList.remove("hidden");

  try {
    const response = await fetch(
      `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "youtube-media-downloader.p.rapidapi.com"
        }
      }
    );

    const data = await response.json();

    loader.classList.add("hidden");

    if (!data || !data.title) {
      showError("No se pudo obtener el video");
      return;
    }

    showResult({
      title: data.title,
      thumbnail: data.thumbnails[0].url,
      videoFormats: data.formats
        .filter(f => f.hasVideo)
        .slice(0, 5)
        .map(f => ({
          quality: f.qualityLabel,
          url: f.url
        })),
      audioFormats: data.formats
        .filter(f => f.hasAudio && !f.hasVideo)
        .slice(0, 3)
        .map(f => ({
          quality: "Audio",
          url: f.url
        }))
    });

  } catch (err) {
    loader.classList.add("hidden");
    showError("Error conectando con la API");
  }
}

// UI igual que antes
function showResult(data) {
  document.getElementById("thumbnail").src = data.thumbnail;
  document.getElementById("title").innerText = data.title;

  const videoOptions = document.getElementById("videoOptions");
  const audioOptions = document.getElementById("audioOptions");

  videoOptions.innerHTML = "";
  audioOptions.innerHTML = "";

  data.videoFormats.forEach(v => {
    const btn = document.createElement("button");
    btn.innerText = "MP4 " + (v.quality || "HD");
    btn.onclick = () => window.open(v.url);
    videoOptions.appendChild(btn);
  });

  data.audioFormats.forEach(a => {
    const btn = document.createElement("button");
    btn.innerText = "MP3";
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

function resetUI() {
  document.getElementById("result").classList.add("hidden");
  document.getElementById("error").classList.add("hidden");
}
