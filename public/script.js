let svePjesme = [];
let playlista = [];

const csvUrl = 'glazba.csv'; 

// Dohvaćanje i obrada podataka
fetch(csvUrl)
    .then(res => res.text())
    .then(csvText => {
        const rezultat = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });

        svePjesme = rezultat.data.map(p => ({
            artist: p.Izvođač,
            song: p.Naslov,
            year: Number(p.Godina),
            tempo: Number(p.BPM),
            mood: p.Raspoloženje
        }));

        prikaziTablicu(svePjesme);
    });

// Prikaz tablice s gumbom "Dodaj u playlistu"
function prikaziTablicu(podaci) {
    const tbody = document.querySelector('#glazba-tablica tbody');
    if (!tbody) return;
    tbody.innerHTML = ''; 

    podaci.forEach((pjesma) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pjesma.artist}</td>
            <td>${pjesma.song}</td>
            <td>${pjesma.year}</td>
            <td>${pjesma.tempo}</td>
            <td>${pjesma.mood}</td>
            <td><button onclick="dodajUPlaylistu('${pjesma.song.replace(/'/g, "\\'")}')">Dodaj +</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Logika za Playlistu
function dodajUPlaylistu(naslovPjesme) {
    const pjesma = svePjesme.find(p => p.song === naslovPjesme);
    
    // Provjera da pjesma već nije u playlisti
    if (!playlista.find(p => p.song === naslovPjesme)) {
        playlista.push(pjesma);
        osvjeziPrikazPlaylisti();
    } else {
        alert("Pjesma je već na tvojoj playlisti!");
    }
}

function ukloniIzPlaylisti(index) {
    playlista.splice(index, 1);
    osvjeziPrikazPlaylisti();
}

function osvjeziPrikazPlaylisti() {
    const listaUI = document.getElementById('lista-playlist');
    const brojac = document.getElementById('brojac-pjesama');
    const gumbPotvrdi = document.getElementById('potvrdi-playlistu');

    listaUI.innerHTML = '';
    brojac.innerText = playlista.length;

    playlista.forEach((pjesma, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = "5px";
        li.innerHTML = `<strong>${pjesma.artist}</strong> - ${pjesma.song} 
            <button onclick="ukloniIzPlaylisti(${index})" style="color:red; margin-left:10px;">Ukloni</button>`;
        listaUI.appendChild(li);
    });

    // Prikaži gumb za potvrdu samo ako playlista nije prazna
    gumbPotvrdi.style.display = playlista.length > 0 ? 'inline-block' : 'none';
}

document.getElementById('potvrdi-playlistu').addEventListener('click', () => {
    alert(`Uspješno ste dodali ${playlista.length} pjesama na svoju playlistu za slušanje!`);
    playlista = [];
    osvjeziPrikazPlaylisti();
});

// Filtriranje
function filtrirajPodatke() {
    const pojam = document.getElementById('pretraga').value.toLowerCase();
    const odabranoRaspolozenje = document.getElementById('filter-mood').value;
    
    const godOd = parseInt(document.getElementById('godina-od').value) || 0;
    const godDo = parseInt(document.getElementById('godina-do').value) || 2026;

    const filtrirano = svePjesme.filter(pjesma => {
        const podudaraSeTekst = (pjesma.artist && pjesma.artist.toLowerCase().includes(pojam)) || 
                                (pjesma.song && pjesma.song.toLowerCase().includes(pojam));
        
        const podudaraSeMood = odabranoRaspolozenje === 'sve' || pjesma.mood === odabranoRaspolozenje;
        const podudaraSeGodina = pjesma.year >= godOd && pjesma.year <= godDo;
        
        return podudaraSeTekst && podudaraSeMood && podudaraSeGodina;
    });

    prikaziTablicu(filtrirano);
}

document.getElementById('pretraga').addEventListener('input', filtrirajPodatke);
document.getElementById('filter-mood').addEventListener('change', filtrirajPodatke);
document.getElementById('godina-od').addEventListener('input', filtrirajPodatke);
document.getElementById('godina-do').addEventListener('input', filtrirajPodatke);