const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 8080;


app.use('/three.module.js', express.static(path.join(__dirname, '/js/three.module.js')));
app.use('/threejs-toys.module.min.js', express.static(path.join(__dirname, '/js/threejs-toys.module.min.js')));
app.use('/style-slider-nv.css', express.static(path.join(__dirname,'/css/style-slider-nv.css')))




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index-slider-nv.html'));
});


app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});