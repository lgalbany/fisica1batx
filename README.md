# Física 1r de batxillerat · En moviment

Aplicació web en català per practicar cinemàtica de primer de batxillerat tecnològic.

## Contingut

- 73 exercicis adaptats del dossier de classe, numerats com a l’original.
- Pistes progressives, correcció de respostes i resolucions pas a pas.
- Set models d’entrenament amb dades noves i resultats recalculats.
- Formulari de física, gràfiques i exploració de trajectòries.
- Notes i progrés al navegador, amb exportació i importació de còpies JSON.

No requereix instal·lació, comptes d’alumna, servidor propi ni claus d’API. Funciona amb HTML, CSS i JavaScript sense dependències externes.

## Publicar amb GitHub Pages

1. Obre **Settings → Pages** del repositori.
2. A **Source**, selecciona **Deploy from a branch**.
3. Tria la branca **main**, la carpeta **/docs** i prem **Save**.
4. GitHub mostrarà l’adreça pública quan s’hagi completat el desplegament.

Els canvis als fitxers de `docs/` es publicaran automàticament un cop activada aquesta configuració. Les rutes dels recursos són relatives i funcionen sota el nom del repositori.

## Estructura

- `docs/index.html`: estructura i contingut general.
- `docs/style.css`: disseny adaptable a mòbil i ordinador.
- `docs/data.js`: banc d’exercicis i solucions.
- `docs/app.js`: navegació, correcció, entrenament i progrés.
- `check.cjs`: comprovacions de dades, càlculs i fluxos amb un DOM simulat.

Amb Node.js, executa `node check.cjs` per fer les comprovacions.

## Progrés i dades

Les respostes i les notes es guarden només al navegador i al domini on es treballa. No se sincronitzen entre ordinadors, navegadors o dominis. Per continuar des d’un altre dispositiu o passar de l’adreça inicial a GitHub Pages, exporta el progrés i importa’l al lloc de destí.

El codi i els enunciats del repositori són públics. No hi ha dades personals d’alumnes, claus d’API ni credencials als fitxers de l’aplicació.

## Abast i criteris

Inclou cinemàtica de les unitats 7 i 8; encara no inclou MHS, dinàmica, energia ni gravitació. Alguns apartats simbòlics es treballen introduint components o coeficients; les expressions completes són a la resolució. Els dibuixos i les justificacions obertes són per a autorevisió.

La correcció numèrica admet un marge de l’1% amb un mínim de 0,005 en la unitat indicada. S’han recalculat les respostes i s’indiquen correccions de les errates detectades al dossier. Les hipòtesis i el valor de g s’expliciten als enunciats.

Els enunciats s’han adaptat del dossier aportat a classe, traduït i modificat de l’IES Ruiz Gijón.
