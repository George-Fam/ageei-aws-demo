# Déploiement Azure Function App

Template pour recréer la Function App `ageei-admin-api` (Flex Consumption, Java 17, Canada Est).

## Valeur à remplir avant de déployer

Dans `parameters.json`, remplacer `SUBSCRIPTION_ID` par l'identifiant de l'abonnement Azure. On le trouve dans le portail Azure sous **Abonnements**.

## Déploiement

```bash
az login
az deployment group create \
  --resource-group Ageei.org_main_site \
  --template-file template.json \
  --parameters @parameters.json
```