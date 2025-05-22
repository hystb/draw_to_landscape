// 🎨 Initialisation du canvas visible
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 🔧 Outils
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

// 🎯 État du dessin
let drawing = false;
let currentColor = colorPicker.value;
let currentSize = brushSize.value;
let paths = [];
let currentPath = [];

// 🎯 Fenêtre draggable
const titleBar = document.querySelector('.title-bar');
const container = document.querySelector('.container');
let isDragging = false;
let offset = { x: 0, y: 0 };

// 🪄 Centrage initial de la fenêtre
window.onload = () => {
  const centerX = (window.innerWidth - container.offsetWidth) / 2;
  const centerY = (window.innerHeight - container.offsetHeight) / 2;
  container.style.left = `${centerX}px`;
  container.style.top = `${centerY}px`;
};

// 🎚️ Mise à jour des outils
colorPicker.addEventListener('input', () => {
  currentColor = colorPicker.value;
});
brushSize.addEventListener('input', () => {
  currentSize = brushSize.value;
});

// ✏️ Gestion du dessin
canvas.addEventListener('mousedown', () => {
  drawing = true;
  currentPath = [];
});

canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
  if (currentPath.length > 0) {
    paths.push({ path: currentPath, color: currentColor, size: currentSize });
  }
});

canvas.addEventListener('mouseleave', () => {
  drawing = false;
  ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;

  const x = e.offsetX;
  const y = e.offsetY;

  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = currentColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  currentPath.push({ x, y });
}

// 🧼 Effacer tout
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths = [];
}

// ↩️ Annuler le dernier trait
function undo() {
  if (paths.length === 0) return;
  paths.pop();
  redrawAll();
}

function redrawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of paths) {
    ctx.beginPath();
    ctx.lineWidth = p.size;
    ctx.strokeStyle = p.color;
    const points = p.path;
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
  }
  ctx.beginPath();
}

// 🚀 Génération IA (avec fond blanc)
async function uploadSketch() {
  const loader = document.getElementById('loader');
  loader.style.display = 'flex';

  try {
    // 👉 Utilise le canvas caché pour copier avec fond blanc
    const hiddenCanvas = document.getElementById('hiddenCanvas');
    const hiddenCtx = hiddenCanvas.getContext('2d');

    // Remplit en blanc
    hiddenCtx.fillStyle = '#ffffff';
    hiddenCtx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // Dessine le canvas visible par-dessus
    hiddenCtx.drawImage(canvas, 0, 0);

    // Conversion en image
    const dataURL = hiddenCanvas.toDataURL('image/png');
    const blob = await (await fetch(dataURL)).blob();
    const formData = new FormData();
    formData.append('sketch', blob, 'sketch.png');
    formData.append('prompt', "a beautiful landscape");

    const response = await fetch('/generate', {
      method: 'POST',
      body: formData
    });

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } catch (error) {
    alert("Une erreur est survenue lors de la génération.");
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}

// 🪟 Déplacement de la fenêtre avec la title-bar
titleBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  offset.x = e.clientX - container.offsetLeft;
  offset.y = e.clientY - container.offsetTop;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    container.style.left = `${e.clientX - offset.x}px`;
    container.style.top = `${e.clientY - offset.y}px`;
  }
});
