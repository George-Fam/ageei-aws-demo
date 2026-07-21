# API: Synchronisation du calendrier AGEEI

Azure Function (Java 17) qui synchronise les événements du CMS Directus vers Google Calendar.
Déclenchée par un webhook Directus ou automatiquement chaque nuit à 3h.

## Prérequis
- Java 17
- Maven
- Node.js (pour les outils Azure) (ou installer avec votre package manager préféré)

### Outils Azure Functions et Azurite
```bash
npm install -g azure-functions-core-tools@4
npm install -g azurite
```

## Configuration locale

- Copie le fichier de configuration template et remplis les valeurs : 
`cp local.settings.json.template local.settings.json`
- Modifie `local.settings.json` avec les vraies valeurs :

| Variable                     | Description                                                                     |
|------------------------------|---------------------------------------------------------------------------------|
| `GOOGLE_CALENDAR_ID`         | L'identifiant du Google Calendar cible (ex. `abc123@group.calendar.google.com`) |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Le JSON du compte de service Google, encodé en base64 (voir ci-dessous)         |
| `GOOGLE_IMPERSONATED_USER`   | L'utilisateur Google Workspace à impersonifier (ex. `technologie@ageei.org`)    |
| `DIRECTUS_URL`               | L'URL du CMS Directus (ex. `https://cms.ageei.org`)                             |
| `WEBHOOK_SECRET`             | Le secret partagé entre Directus et cette fonction                              |



### Encoder la clé du compte de service Google

- Le JSON du compte de service doit être encodé en base64 pour éviter des problèmes avec les sauts de ligne : 
`base64 -w 0 service-account.json`

## Démarrage Local

### 1. Démarrer Azurite (émulateur de stockage Azure)

```bash
azurite --location /tmp/azurite
```

### 2. Compiler et démarrer la fonction

Dans un autre terminal :

```bash
mvn clean package
mvn azure-functions:run
```

Les fonctions sont disponibles à `http://localhost:7071/api/`.

## Tester localement

### Déclencher la synchronisation via webhook

```bash
curl -X POST http://localhost:7071/api/sync-calendar \
  -H "X-Webhook-Secret: ton-webhook-secret"
```

### Déclencher le timer manuellement
Le timer ne se déclenche pas selon son horaire en mode local. Pour le tester manuellement :

```bash
curl -X POST http://localhost:7071/admin/functions/syncCalendarScheduled \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Tests Unitaires

```bash
mvn test
```