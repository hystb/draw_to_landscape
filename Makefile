# Nom du service (à adapter si nécessaire)
SERVICE=croquis
PORT=5000

# Commande : builder l'image
build:
	docker compose build $(SERVICE)

# Commande : lancer les services
up:
	docker compose up $(SERVICE)

# Commande : arrêter les services
down:
	docker compose down

# Commande : reconstruire + relancer
rebuild:
	docker compose down
	docker compose build $(SERVICE)
	docker compose up $(SERVICE)

# Commande : logs en live
logs:
	docker compose logs -f $(SERVICE)

# Commande : shell interactif dans le conteneur
bash:
	docker exec -it $(SERVICE)_app bash

# Commande : tester le serveur en local
curl:
	curl -X POST -F "sketch=@test.png" -F "prompt=a beautiful landscape" http://localhost:$(PORT)/generate --output output.png
