# Client web de l’AGEEI

Application Angular du site public de l’Association générale des étudiantes et étudiants en informatique de l’UQAM.

Le site réunit les services aux membres, les activités étudiantes, les publications, les documents officiels et les coordonnées de l’association. Le contenu appelé à changer pendant la session vient principalement du CMS Directus.

## Pages

| Route          | Contenu                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| `/`            | Mission, prochain événement, publication à la une et boutique            |
| `/posts`       | Publications de l’association                                            |
| `/calendrier`  | Événements, filtres, aperçu et abonnement Google Calendar                |
| `/clubs`       | Clubs et initiatives étudiantes                                          |
| `/finissants`  | Information et liens pour les cohortes finissantes                       |
| `/ordinateurs` | Programme de portables remis à neuf CLIC-OPEQ                            |
| `/documents`   | Documents importants et procès-verbaux                                   |
| `/charte`      | Charte, officiers, comités et table des matières                         |
| `/faq`         | Questions fréquentes avec recherche                                      |
| `/contact`     | Exécutif, comités, réseaux sociaux et coordonnées                        |
| `/sponsors/fr` | Redirection vers le forfait de commandite en français                    |
| `/sponsors/en` | Redirection vers le sponsorship package en anglais                       |

Les routes sont chargées à la demande depuis `src/app/app-routing.module.ts`. La page introuvable prend en charge toutes les routes restantes.

## Navigation

Le menu principal est organisé en trois groupes : Vie étudiante, Ressources et Association. Le pied de page reprend la même structure et ajoute les réseaux sociaux.

Sur mobile, le menu occupe la fenêtre complète. Son état est géré par `HeaderComponent`, qui ferme aussi le menu avec la touche Échap.

Les liens de navigation sont définis dans :

- `src/app/shared/layout/header/header.component.ts`
- `src/app/shared/layout/footer/footer.component.ts`

Modifier les deux fichiers lorsqu’une route publique est ajoutée ou renommée.

## Contenu et services externes

Directus fournit la charte, la FAQ, les exécutifs, les comités, les documents, les publications et les événements. La page d’accueil demande séparément le prochain événement et la publication à la une. Si aucune donnée n’est disponible, le bloc correspondant n’est pas affiché.

En développement, les requêtes vers Directus passent par `/cms-api`. Le relais est configuré dans `proxy.conf.json` et pointe vers `https://cms.ageei.org`.

Les adresses du CMS et du calendrier sont définies dans :

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Google Calendar sert à afficher le calendrier public et à fournir le lien d’abonnement.

## Forfaits de commandite

Le dossier voisin `../sponsor-package` contient les versions française et anglaise du forfait. Pendant le build Angular, les fichiers nécessaires sont copiés dans `public/sponsor-package` selon la configuration `assets` de `angular.json`.

Les routes `/sponsors/fr` et `/sponsors/en` redirigent vers les documents produits. Le code de redirection se trouve dans `src/app/sponsors`.

## Installation

Prérequis :

- Node.js compatible avec Angular 21
- npm

Installer les dépendances :

```bash
npm install
```

Lancer le serveur local :

```bash
npm start
```

Le site est disponible sur `http://localhost:4200/`.

## Commandes

```bash
npm start
```

Lance le serveur Angular avec le proxy Directus.

```bash
npm run build
```

Produit le build de déploiement dans `public/`.

```bash
npm run lint
```

Vérifie les fichiers TypeScript et les templates Angular.

```bash
npm run prettier-check
```

Signale les fichiers sources dont le formatage ne correspond pas à la configuration du projet.

```bash
npm run prettier-fix
```

Formate les fichiers sources pris en charge.

## Organisation du code

```text
src/app/
  accueil/          page d’accueil et encart de la boutique
  charte/           charte et table des matières
  clubs/            clubs étudiants
  contact/          exécutif, comités et coordonnées
  documents/        documents officiels
  faq/              questions fréquentes
  finissants/       information pour les finissants
  member-services/  ordinateurs CLIC-OPEQ
  posts/            publications
  sponsors/         redirections vers les forfaits
  timeline/         calendrier et événements
  shared/           composants réutilisables, en-tête et pied de page
```

Chaque page publique conserve son module de route. Les composants réutilisés par plusieurs pages vont dans `shared`. Les appels Directus passent par les services existants plutôt que par les composants d’interface.

## Ajouter une page

1. Créer le composant, le module et le module de route.
2. Ajouter le chargement différé dans `app-routing.module.ts`.
3. Ajouter le lien dans le menu et le pied de page si la page est publique.
4. Définir le titre, la description et les métadonnées sociales.
5. Prévoir les états de chargement, d’erreur et de contenu vide pour les données distantes.
6. Vérifier la page sur ordinateur et sur mobile.

## Vérification avant fusion

```bash
npm run lint
npm run prettier-check
npm run build
```

Pour un changement visuel, vérifier au minimum les largeurs 375, 768 et 1440 pixels. Tester le menu mobile, la navigation au clavier, les états sans contenu et les erreurs réseau des pages touchées.

## Azure Static Web Apps

- `src/staticwebapp.config.json` configure le comportement de l’application statique, incluant les routes et l’authentification/autorisation.
- Documentation : [Configurer Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/configuration)
