DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_FILE = ./docker-compose.yml

.phony : setup stop start re log clean build

all : setup start

setup :
	@echo "----Setup Docker-----------"

start : build
	@echo "----Starting all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "----All Docker started-----"

stop :
	@echo "----Stopping all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop
	@echo "----All Docker stopped-----"

build :
	@echo "----Building all Docker----"
	mkdir -p /home/transcendence/Backend
	mkdir -p /home/transcendence/Frontend
	mkdir -p /home/transcendence/Database
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build
	@echo "----All Docker built-------"

clean : stop
	@echo "----Cleaning all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --rmi all --remove-orphans
	rm -rf /home/transcendence/Backend
	rm -rf /home/transcendence/Frontend
	rm -rf /home/transcendence/Database
	@echo "----All Docker cleaned-----"

log :
	@echo "----Status Docker----------"
	docker ps

refront :
	@echo "----Restarting Frontend----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart frontend

reback :
	@echo "----Restarting Backend-----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart backend

redata :
	@echo "----Restarting Database----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart database

re : clean stop start