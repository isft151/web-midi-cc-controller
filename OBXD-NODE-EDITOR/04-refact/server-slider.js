const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 8080;

// Servir solo los archivos JavaScript que deseas
app.use('/three.module.js', express.static(path.join(__dirname, '/js/three.module.js')));
app.use('/threejs-toys.module.min.js', express.static(path.join(__dirname, '/js/threejs-toys.module.min.js')));

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});