const express = require('express');
const path = require('path');
const app = express();

// Postavljanje EJS kao engine-a za predloške
app.set('view engine', 'ejs');

// Posluživanje statičkih datoteka (CSS, slike) iz mape 'public' 
app.use(express.static(path.join(__dirname, 'public')));

// 1. Ruta za početnu stranicu (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Ruta za grafikon
app.get('/grafikon', (req, res) => {
    res.sendFile(path.join(__dirname, 'grafikon.html'));
});

// 3. Ruta za dinamičku galeriju (EJS)
app.get('/slike', (req, res) => {
    const brojSlika = 20;
    res.render('slike', { brojSlika: brojSlika });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}`);
});