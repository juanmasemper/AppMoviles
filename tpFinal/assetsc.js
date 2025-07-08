const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Crear directorio assets si no existe
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// SVGs base
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#4A90E2"/>
  <text x="512" y="600" font-family="Arial, sans-serif" font-size="200" font-weight="bold" text-anchor="middle" fill="white">
    PalabrAr
  </text>
  <circle cx="512" cy="300" r="100" fill="white" opacity="0.2"/>
</svg>
`;

const faviconSvg = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#4A90E2"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">P</text>
</svg>
`;

// Guardar SVGs base
fs.writeFileSync(path.join(assetsDir, 'icon-template.svg'), iconSvg);
fs.writeFileSync(path.join(assetsDir, 'favicon-template.svg'), faviconSvg);

// Función para generar PNG a partir de SVG
async function generarPNG(nombreArchivo, svgContenido, ancho, alto) {
  const outputPath = path.join(assetsDir, nombreArchivo);
  await sharp(Buffer.from(svgContenido)).resize(ancho, alto).png().toFile(outputPath);
}

// Ejecutar generación
(async () => {
  await generarPNG('icon.png', iconSvg, 1024, 1024);
  await generarPNG('adaptive-icon.png', iconSvg, 1024, 1024);
  await generarPNG('favicon.png', faviconSvg, 32, 32);

  // Splash screen solo con color de fondo (azul)
  const splashPath = path.join(assetsDir, 'splash.png');
  await sharp({
    create: {
      width: 1284,
      height: 2778,
      channels: 4,
      background: '#4A90E2'
    }
  }).png().toFile(splashPath);

  console.log('✅ Todos los assets fueron generados en /assets');
})();