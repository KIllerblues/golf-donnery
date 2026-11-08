# Golf Donnery

Appli web (PWA) de GPS de golf pour le golf d'Orléans Donnery : distances au green, aux bunkers et à l'eau, carte de score, fonctionnement hors-ligne.

- Fond de carte : imagerie satellite Esri World Imagery (tuiles © Esri, Maxar, Earthstar Geographics).
- Carte : [Leaflet](https://leafletjs.com/) 1.9.4 (`leaflet.js`, `leaflet.css`).
- Les repères des trous sont enregistrés dans le navigateur (localStorage). Export/import JSON depuis le menu.

## Utilisation

1. Ouvrir la page en HTTPS (obligatoire pour le GPS) sur le téléphone, puis « Installer l'application ».
2. Mode ✎ : pointer tee, green (avant/centre/arrière), bunkers et eau de chaque trou.
3. Mode jeu : les distances se mettent à jour avec la position GPS.
4. Menu → « Télécharger la carte » (en Wi-Fi) pour jouer sans réseau.

## Tester en local

```bash
python -m http.server 8123
# http://localhost:8123/index.html?sim=47.9012,2.1030   (position GPS simulée)
```

## Mise en ligne

GitHub Pages : Settings → Pages → Deploy from a branch → `main` / root.

## Parcours partagé et protection des données

- Les repères (greens, bunkers, eau) sont gardés dans le téléphone et **ne sont jamais effacés par « Nouvelle partie »** : seuls les scores sont remis à zéro, et ils sont archivés dans l'historique.
- Avant tout écrasement (import, application du dépôt, vidage d'un trou, effacement complet), une copie de secours est gardée : Menu → « Annuler le dernier écrasement ».
- `parcours.json` à la racine du dépôt est la copie partagée du parcours. L'appli la lit à l'ouverture : si le téléphone n'a plus de repères (données Chrome vidées, nouveau téléphone), elle les recharge toute seule. S'il en a, elle propose d'appliquer la version du dépôt quand elle est plus récente.
- Pour publier un parcours pointé : Menu → « Exporter le parcours » (télécharge `parcours.json`), puis l'envoyer dans le dépôt (Add file → Upload files) en remplaçant l'ancien.
