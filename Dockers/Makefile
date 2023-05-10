.phony : setup stop start re log clean build

all : setup start

DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_FILE = ./srcs/docker-compose.yml

setup :
	@echo "----Setup Docker-----------"

stop :
	@echo "----Stopping all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop
	@echo "----All Docker stopped-----"

build :
	@echo "----Building all Docker----"
	mkdir -p /home/tquere/data/wordpress
	mkdir -p /home/tquere/data/mariadb
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build
	@echo "----All Docker built-------"

start : build
	@echo "----Starting all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "----All Docker started-----"

clean : stop
	@echo "----Cleaning all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --rmi all --remove-orphans
	rm -rf /home/tquere/data/wordpress
	rm -rf /home/tquere/data/mariadb
	@echo "----All Docker cleaned-----"

log :
	@echo "----Status Docker----------"
	docker ps

re : clean stop start