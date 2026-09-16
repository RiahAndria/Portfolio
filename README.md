# Portfolio

Portfolio statique en HTML, CSS et JavaScript, sans framework ni dependance a installer.
L'interface reprend les codes d'un terminal : palette sombre, accents violet/cyan,
fenetres de configuration, transitions legeres et cartes projets interactives.

## Structure

```text
.
├── index.html
├── content.json
├── styles/
│   └── main.css
├── scripts/
│   └── main.js
├── assets/
│   └── gestion-enseignants/
│       └── img1.jpg
├── views/
│   └── projects/
│       ├── gestion-medicale.html
│       ├── gestion-financiere.html
│       ├── gestion-session-cepe.html
│       ├── gestion-enseignants.html
│       └── gestion-soutenances.html
└── README.md
```

`index.html` est la page d'accueil. Les pages de `views/projects/` sont les pages
de detail accessibles en cliquant sur les cartes de la section Projets.

## Lancer le projet

Le contenu est chargé depuis `content.json`, donc le portfolio doit être lancé
avec un serveur local (l'ouverture directe en `file://` bloque le chargement JSON).
Pour lancer le serveur :

```powershell
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Modifier le contenu

Le fichier `content.json` centralise les textes, liens, images du hero, competences,
projets, descriptions, metadonnees et legendes de galerie. Modifiez ce fichier pour
mettre a jour le contenu sans toucher aux pages HTML.

Les chemins d'images sont relatifs a la racine du projet, par exemple
`assets/gestion-enseignants/img1.jpg`.

## Ajouter les liens GitHub

Chaque page de projet contient actuellement un placeholder :

```html
<a class="flag-link" href="#">--github lien du repo a ajouter</a>
```

Remplacer uniquement `#` par l'URL du repository correspondant dans le fichier
de detail du projet.

## Ajouter les captures

Ranger les images par projet dans `assets/` :

```text
assets/
└── gestion-enseignants/
	├── img1.jpg
	├── img2.jpg
	└── img3.jpg
```

Dans la page de detail, la premiere image de chaque galerie doit etre la page
d'accueil de l'application. Les images sont cliquables et s'ouvrent dans une
visionneuse avec navigation precedente/suivante.

Les chemins depuis une page de `views/projects/` commencent par :

```html
../../assets/nom-du-projet/nom-image.png
```

Pour l'aperçu de la section hero et de la section Competences dans `index.html`,
les chemins commencent par :

```html
assets/nom-du-projet/nom-image.png
```

Les couleurs, typographies, animations et composants sont centralises dans
`styles/main.css`. Le menu mobile, les animations de page, les cartes cliquables
et la visionneuse d'images sont geres dans `scripts/main.js`.
