// ho commentato l'index originale, questo è quello modificato e che viene caricato, da index.html, riga 29
window.addEventListener("DOMContentLoaded", (event) => {
  const svg = d3.select("svg");

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  let pattern = null; // sarà la mappa di sfondo scaricato dalla rest a riga 11
  let dataset = {}; // dataset

  /*  siccome le chiamate sono asincrone, e abbiamo bisogno di avere sia il pattern che il dataset 
      pronti prima di poter fare qualsiasi cosa, ho creato due funzioni, loadWorld e loadAll che vengono chiamate dopo 
      (nelle due then) che i vari caricamenti si sono conclusi. 
      Quindi, dopo le prime impostazioni da riga 5 a 8 si parte con la prima chiamata, che carica il dataset, riga 28
      puoi vedere che ho utilizzato il ciclo "for-of" che va ad agire direttamente sugli elementi dell'array,
      e non usa l'indice come invece fa il for classico, ti lascio il link w3school:
      https://www.w3schools.com/js/js_loop_forof.asp
      se il ciclo a riga 32 non ti è chiaro non ti preoccupare, lo vediamo in seguito, in pratica studiando come creava il dataset
      l'index originale, ho capito che in realtà basta usarlo come oggetto e non come array di oggetti, quindi ho creato un dataset
      come oggetto (riga 8) e gli elementi sono formati dalla chiave che è el.code e il valore che è el.pop (riga 33).
      dataset[el.code] crea proprio l'elemento dell'oggetto con chiave el.code, il risultato lo vedi proprio dal console.log
      successivo, riga 35. a questo punto il dataset è pronto.
      dopo di che viene chiamata loadWorld, riga 36, che fa la chiamta per caricare il pattern, riga 40, qui
      va tutto liscio, si associa il pattern alla risposta della chiamata,riga 43, e viene innescata la funzione loadAll 
      che esegue le funzioni di d3 per creare la mappa con gli stati colorati
      */

  d3.csv(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"
  ).then((response) => {
    console.log("[ world population response ] ", response);
    for (let el of response) {
      dataset[el.code] = el.pop;
    }
    console.log("[ dataset dopo il for-of ]", dataset);
    loadWorld();
  });

  function loadWorld() {
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    ).then((res) => {
      pattern = res;
      console.log("[ pattern ] ", pattern);
      loadAll();
    });
  }

  function loadAll() {
    // Map and projection
    const path = d3.geoPath();
    const projection = d3
      .geoAzimuthalEqualArea()
      .scale(70)
      .center([0, 20])
      .translate([width / 2, height / 2]);

    // Data and color scale
    let data = new Map();
    const colorScale = d3
      .scaleThreshold()
      .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .range(d3.schemeBlues[7]);

    let topo = pattern;
    // Draw the map
    svg
      .append("g")
      .selectAll("path")
      .data(topo.features)
      .join("path")
      // draw each country
      .attr("d", d3.geoPath().projection(projection))
      // set the color of each country
      .attr("fill", function (d) {
        d.total = dataset[d.id] || 0;
        if (d.total == 0) {
          return "#000";
        }
        return colorScale(d.total);
      });
  }
});
