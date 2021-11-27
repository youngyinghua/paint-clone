const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");
const { body } = document;

// Global Variables
const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");
let currentSize = 10;
let bucketColor = "#FFFFFF";
let currentColor = "#A51DAB";
//
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

//Setting Brush Size
brushSlider.addEventListener("change", () => {
  currentSize = brushSlider.value;
  brushSize.textContent =
    brushSlider.value < 10 ? `0${brushSlider.value}` : brushSlider.value;
});

// Setting Brush Color
brushColorBtn.addEventListener("change", () => {
  currentColor = `#${brushColorBtn.value}`;
});

// Setting Background Color
bucketColorBtn.addEventListener("change", () => {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
});

// Eraser
eraser.addEventListener("click", () => {
  isEraser = true;
  activeToolEl.textContent = "Eraser";
  brushIcon.style.color = "white";
  eraser.style.color = "black";
  currentColor = bucketColor;
  currentSize = brushSlider.value;
});

// Switch back to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = "Brush";
  brushIcon.style.color = "black";
  eraser.style.color = "white";
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSize.textContent = 10;
  brushSlider.value = 10;
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

// Clear Canvas
clearCanvasBtn.addEventListener("click", () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = "Canvas Cleared";
  setTimeout(() => {
    activeToolEl.textContent = "Brush";
  }, 800);
});

// Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = "round";
    if (drawnArray[i].erase) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = "round";
  context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser
    );
  } else {
    // storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// Save to Local Storage
saveStorageBtn.addEventListener("click", () => {
  localStorage.setItem("drawnArray", JSON.stringify(drawnArray));
  localStorage.setItem("bucketColor", bucketColor);
  // Active Tool
  activeToolEl.textContent = "Canvas Saved";
  setTimeout(switchToBrush, 1500);
});

// Load from Local Storage
loadStorageBtn.addEventListener("click", () => {
  if (localStorage.getItem("drawnArray")) {
    drawnArray = JSON.parse(localStorage.getItem("drawnArray"));
    bucketColor = localStorage.getItem("bucketColor");
    createCanvas();
    restoreCanvas();
    // Active Tool
    activeToolEl.textContent = "Canvas Loaded";
    setTimeout(switchToBrush, 1500);
  } else {
    activeToolEl.textContent = "No Canvas Found";
    setTimeout(switchToBrush, 1500);
  }
});

// Clear Local Storage
clearStorageBtn.addEventListener("click", () => {
  localStorage.removeItem("drawnArray");
  localStorage.removeItem("bucketColor");
  // Active Tool
  activeToolEl.textContent = "Local Storage Cleared";
  setTimeout(switchToBrush, 1500);
});

// Download Image
downloadBtn.addEventListener("click", () => {
  downloadBtn.href = canvas.toDataURL("image/jpeg", 1.0);
  downloadBtn.download = "paint-sample";
  // Active Tool
  activeToolEl.textContent = "Image File Saved";
  setTimeout(switchToBrush, 1500);
});

// Event Listener
brushIcon.addEventListener("click", switchToBrush);

// On Load
createCanvas();
