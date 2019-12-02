include .env

.PHONY: test

DOCKER=docker
DOCKER_COMPOSE=docker-compose
DB_YML=docker-compose-databases.yml

default: build

dc-build:
	$(DOCKER_COMPOSE) build app

# ---------- DEVELOPMENT ----------

start: dc-build
	$(DOCKER_COMPOSE) run --service-ports app start

dev: dc-build
	$(DOCKER_COMPOSE) run --service-ports app run dev

 # Starts the database dependencies via docker-compose in detached mode
start-dbs:
	$(DOCKER_COMPOSE) -f $(DB_YML) up -d

# Stops the database dependencies
stop-dbs:
	$(DOCKER_COMPOSE) -f $(DB_YML) down

sh: dc-build-app
	$(DOCKER_COMPOSE) run --entrypoint=sh --service-ports --rm app

lint: dc-build-app
	$(DOCKER_COMPOSE) run app run lint

dc-build-app:
	$(DOCKER_COMPOSE) build app

# ---------- TEST ----------

test: dc-build
	$(DOCKER_COMPOSE) run -e NODE_ENV=test app run test

coverage: dc-build
	$(DOCKER_COMPOSE) run -e NODE_ENV=test app run coverage

# ---------- PRODUCTION ----------

# Create a production build docker image
build:
	$(DOCKER) build -t $(DOCKER_REG)$(SERVICE_NAME) .

build-agent:
	$(DOCKER_COMPOSE) rm -sf
	$(DOCKER_COMPOSE) -f docker-compose-ba.yml build app
	$(DOCKER_COMPOSE) -f docker-compose-ba.yml run --name $(SERVICE_NAME) -e NODE_ENV=test app run coverage
	$(DOCKER) cp $(SERVICE_NAME):/code/test-results .
	$(DOCKER) cp $(SERVICE_NAME):/code/coverage .
	$(DOCKER_COMPOSE) rm -sf
