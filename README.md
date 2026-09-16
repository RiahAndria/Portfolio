# Portfolio

Ce projet est un portfolio personnel en HTML, CSS et JavaScript, conçu comme une interface immersive inspirée d'un terminal informatique. L'objectif est de présenter les projets réalisés dans un style visuel cohérent, sombre et technique, avec des éléments interactifs et une navigation fluide.

## Fonctionnement général

Le portfolio est structuré autour d'une page principale, `index.html`, qui sert de vitrine. Elle contient :

- un hero section avec présentation personnelle,
- une section de compétences,
- une section de projets,
- une navigation interne légère,
- des éléments visuels en style terminal (couleurs, fenêtres, accents, transitions).

Le contenu visible est principalement alimenté par `content.json`. Ce fichier centralise les textes, liens, images et métadonnées de chaque projet, ce qui permet de modifier le contenu sans réécrire tout le HTML à chaque changement.

## Organisation du projet

```text
.
├── index.html
├── content.json
├── styles/
│   └── main.css
├── scripts/
│   ├── main.js
│   └── terminal-animations.js
├── assets/
│   ├── bg-hero/
│   ├── gestion-enseignants/
│   ├── Gestion-finances/
│   ├── Gestion-Patients/
│   ├── gestion-soutenance/
│   └── ...
├── views/
│   └── projects/
│       ├── gestion-enseignants.html
│       ├── gestion-financiere.html
│       ├── gestion-medicale.html
│       ├── gestion-session-cepe.html
│       └── gestion-soutenances.html
├── README.md
└── ...
```

## Comment le portfolio fonctionne

### 1. La page d’accueil

`index.html` est la page principale du portfolio. Elle charge les données depuis `content.json` via JavaScript, puis affiche :

- le titre et le texte de présentation,
- les compétences clés,
- les projets disponibles,
- les visuels associés à chaque projet.

### 2. Les projets

Chaque projet est représenté par une carte dans la section “Projets”. En cliquant dessus, l’utilisateur est dirigé vers une page détaillée située dans `views/projects/`.

Ces pages de détail servent à présenter :

- le contexte du projet,
- les fonctionnalités principales,
- les captures d’écran,
- les liens utiles,
- une vision plus complète du travail réalisé.

### 3. Les données centralisées

Les textes et informations du portfolio sont stockés dans `content.json`. Cela permet de garder une séparation claire entre :

- le contenu éditorial,
- la structure HTML,
- le style visuel CSS,
- la logique JavaScript.

Cette séparation rend la maintenance plus simple et évite de modifier plusieurs fichiers pour un même changement de contenu.

### 4. Le design et les interactions

Le style général du portfolio est défini dans `styles/main.css`. Il gère :

- la palette sombre,
- les typographies,
- les cartes de projets,
- les animations,
- les effets visuels de type interface terminal.

La logique d’interaction est dans `scripts/main.js` et `scripts/terminal-animations.js`. Ces fichiers assurent :

- l’affichage dynamique du contenu,
- la navigation entre sections et pages,
- les animations,
- le comportement des galeries d’images,
- la gestion des éléments interactifs.

### 5. Les galeries de captures

Chaque page de projet peut inclure une galerie d’images. Les images sont rangées dans les dossiers `assets/` et affichées selon un système de visionneuse qui permet de passer d’une image à l’autre. Cette partie renforce la présentation visuelle des projets et donne une meilleure idée de leur utilisation réelle.

## Vue d’ensemble

Le portfolio fonctionne comme une application web statique, pensée comme une vitrine digitale de projets. Il combine :

- un design orienté “interface de développement”,
- des contenus centralisés dans un fichier JSON,
- des pages de projet détaillées,
- des interactions JavaScript pour enrichir l’expérience utilisateur.

L’ensemble donne un rendu cohérent, moderne et professionnel, tout en restant simple à maintenir et à faire évoluer.
