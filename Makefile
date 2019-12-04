include .env

# The release agent just runs 'make' and expects a built docker image from it.
default: build

dc-build:
	docker-compose build app

# ---------- Development ----------
start: dc-build
	docker-compose run -e NODE_ENV=development --service-ports --entrypoint=npm app run start

dev: dc-build
	docker-compose run -e NODE_ENV=development --service-ports --entrypoint=npm app run dev

sh: #dc-build
	docker-compose run --entrypoint=sh app


# ---------- Testing ----------
test: dc-build
	- docker-compose down
	docker-compose run --service-ports -e NODE_ENV=test --entrypoint=npm app run test
	- docker-compose down

watch-test: dc-build
	docker-compose run --service-ports -e NODE_ENV=test --entrypoint=npm app run test-watch

coverage: dc-build
	docker-compose run --service-ports -e NODE_ENV=test --entrypoint=npm app run coverage


# ---------- Release Agent ----------
#Server statup: createApp should create an express app
build:
	docker build -t $(DOCKER_REG)$(SERVICE_NAME) .

# Run the docker image like production
prod-run: build
	docker run -it --env-file='.env' -e NODE_ENV=production -e PORT=6200 $(DOCKER_REG)$(SERVICE_NAME)


# ---------- Build Agent ----------
build-agent:
	- docker-compose -f docker-compose-ba.yml down
	- docker-compose -f docker-compose-ba.yml build app
	- docker-compose -f docker-compose-ba.yml run --name $(SERVICE_NAME) --entrypoint=npm -e NODE_ENV=test app run coverage-build-agent
	- docker cp $(SERVICE_NAME):/code/test-results .
	- docker cp $(SERVICE_NAME):/code/coverage .
	- docker-compose -f docker-compose-ba.yml down

lint:
	docker build -t $(SERVICE_NAME)-lint .

	docker run --rm $(SERVICE_NAME)-lint run lint

debug:
	docker-compose \
		run -d \
		-p 6200:6200 \
		-p 5858:5858 \
		--entrypoint=node \
		app \
		--inspect=0.0.0.0:5858 \
		index.js
