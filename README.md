# Site web de l’AGEEI

Application web Angular du site de l’AGEEI.

## Pile technologique

- Angular (TypeScript)
- SCSS

## Pages & fonctionnalités (déjà en place)

L’application est organisée en modules/fonctionnalités sous
`client-web/src/app` :

- **Accueil** (`client-web/src/app/accueil`)
- **Charte** (`client-web/src/app/charte`)
  - Récupération du contenu de la charte via un service.
- **Clubs** (`client-web/src/app/clubs`)
- **Finissants** (`client-web/src/app/finissants`)
- **Services aux membres / ordinateurs CLIC-OPEQ** (`client-web/src/app/member-services`)
- **Documents** (`client-web/src/app/documents`)
- **Publications** (`client-web/src/app/posts`)
- **Contact** (`client-web/src/app/contact`)
- **FAQ** (`client-web/src/app/faq`)
- **Timeline** (`client-web/src/app/timeline`)
  - Modèles + service pour les données.
- **Forfaits de commandite** (`client-web/src/app/sponsors` et `sponsor-package/`)
- **Composants partagés / mise en page** (`client-web/src/app/shared`)
  - En-tête et composants UI réutilisés.

## Azure Static Web Apps

### Déploiement

- Déployé vers Static Web Apps via GitLab CI.

### Configuration

- Configuration ( Routing, Auth, etc. ) Static Web Apps dans le fichier :
  - `src/staticwebapp.config.json`
- Documentation : [Configure Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/configuration)

## Statut

- En cours :
  - Migration du CTF vers Azure.

## Personnes Recherchées

Contactez <technologie@ageei.org> si vous êtes intéressé(e) à contribuer !

- **Développeurs front-end** : Angular, TypeScript, SCSS.
- **Développeurs back-end** : Java, Maven, Azure Functions et intégrations Google.
- **Sécurité** : Audit de sécurité, tests d’intrusion, recommandations de
  durcissement.

