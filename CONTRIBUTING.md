# Guide de contribution — ageei.org

Merci de l'intérêt que vous portez au site de l'AGEEI ! Ce guide explique comment contribuer au projet de façon efficace et cohérente.

---

## Table des matières

1. [Code de conduite](#code-de-conduite)
2. [Prérequis](#prérequis)
3. [Démarrage rapide](#démarrage-rapide)
4. [Flux de travail Git](#flux-de-travail-git)
5. [Soumettre une merge request](#soumettre-une-merge-request)
6. [Standards de code](#standards-de-code)
7. [Signaler un bogue](#signaler-un-bogue)
8. [Contributeurs et contributrices](#contributeurs-et-contributrices)

---

## Code de conduite

Ce projet est maintenu par des bénévoles étudiant(e)s. Nous attendons de toutes les personnes contribuant un comportement respectueux et professionnel. Les communications doivent rester constructives, inclusives et orientées vers la résolution de problèmes.

---

## Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Angular CLI** : `npm install -g @angular/cli`
- Un compte GitLab

---

## Démarrage rapide

```bash
# 1. Cloner le dépôt
git clone <url-du-depot>
cd ageei.org

# 2. Installer les dépendances
cd client-web
npm install

# 3. Lancer le serveur de développement (http://localhost:4200)
npm start

# 4. Vérifier le formatage et la qualité du code
npm run lint
npm run prettier-check
```

---

## Flux de travail Git

### Nommage des branches

Utilisez le préfixe correspondant au type de changement :

| Préfixe     | Usage                                           |
| ----------- | ----------------------------------------------- |
| `feat/`     | Nouvelle fonctionnalité                         |
| `fix/`      | Correction de bogue                             |
| `refactor/` | Refactorisation sans changement de comportement |
| `docs/`     | Documentation uniquement                        |
| `ci/`       | Changements de pipeline CI/CD                   |
| `style/`    | Formatage, espacement (sans changement logique) |

**Exemples :**

```
feat/page-partenaires
fix/affichage-timeline-mobile
docs/mise-a-jour-readme
```

### Convention des messages de commit

Suivez la convention [Conventional Commits](https://www.conventionalcommits.org/fr) :

```
<type>(<portée facultative>): <description courte>

[corps facultatif : explication du pourquoi, pas du quoi]

[pied de page facultatif — références aux issues]
```

**Exemples :**

```
feat(faq): Ajouter section recherche par mot-clé
fix(timeline): Corriger l'ordre d'affichage des événements passés
docs: Mettre à jour le guide de contribution
```

Types valides : `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `ci`, `chore`

---

## Soumettre une merge request

1. **Créez une branche** à partir de `main` :

   ```bash
   git checkout main && git pull
   git switch -c feat/ma-fonctionnalite
   ```

2. **Effectuez vos modifications** en respectant les [standards de code](#standards-de-code).

3. **Vérifiez avant de pousser :**

   ```bash
   npm run lint
   npm run prettier-check
   npm run build
   ```

4. **Poussez votre branche** et ouvrez une merge request sur GitLab.

5. **Remplissez le gabarit de MR** (voir `merge_request_templates/default.md`).

6. Une fois la MR fusionnée, **votre nom ou pseudonyme sera ajouté** à la liste des [contributeurs et contributrices](#contributeurs-et-contributrices) ci-dessous.

> **Note :** Les MRs doivent cibler la branche `main`. Toute MR sans description ou ne passant pas le pipeline CI sera refusée.

---

## Standards de code

### Structure des composants

Chaque nouvelle page suit le patron module Angular :

```
src/app/ma-page/
  ma-page.component.ts
  ma-page.component.html
  ma-page.component.scss
  ma-page.module.ts
  ma-page-routing.module.ts
```

### Règles importantes

- **Sélecteur de composant :** préfixe `app-` en kebab-case (ex. `app-ma-page`)
- **Sélecteur de directive :** camelCase
- **Importer `SharedModule`** plutôt que les modules Angular Material individuellement
- **Mode strict TypeScript**: aucun `any` implicite
- **Prettier :** largeur de ligne 120 caractères, guillemets simples, indentation 2 espaces
- Lancez `npm run prettier-fix` avant chaque commit pour formater automatiquement

### Ce qu'il faut éviter

- Ne pas contourner le pipeline CI (`--no-verify`, etc.)
- Ne pas committer de secrets ou de clés d'API
- Ne pas créer de composants autonomes (_standalone_) : le projet utilise NgModules

---

## Signaler un bogue

Ouvrez une _issue_ GitLab en incluant :

- **Description** : comportement observé vs comportement attendu
- **Étapes pour reproduire** : liste numérotée précise
- **Environnement** : navigateur, OS, version Node
- **Captures d'écran** si applicable

---

## Contributeurs et contributrices

Merci à toutes les personnes qui ont contribué au projet ! Les noms ci-dessous sont ajoutés à chaque merge request fusionnée.

| Nom / Pseudonyme                                   | Rôle principal                      |
| -------------------------------------------------- | ----------------------------------- |
| George Fam (`@georgefam`)                          | Responsable technologie, mainteneur |
| Armand Brière (`@armand`)                          | Développement front-end             |
| Pierre-Olivier Brillant (`@PierreOlivierBrillant`) | Développement front-end             |
| Kim Joziak (`@KimJoziak`)                          | Développement front-end             |
| Sublime (`@Sublime`)                               | Développement front-end             |
| cj291059 (`@cj291059`)                             | Développement front-end             |

> Votre MR a été fusionnée et votre nom n'apparaît pas ici ? Ouvrez une issue ou contactez `technologie@ageei.org`.
