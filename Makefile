# **************************** Makefile Transcendence **************************** #

DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_FILE = ./Dockers/docker-compose.yml

.phony : start stop re clean log reback refront redata rebuild cleandata

# *********************************** RULES ********************************** #

all : start

start :
	@echo "----Starting all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d --build
	@echo "----All Docker started-----"


stop :
	@echo "----Stopping all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down
	@echo "----All Docker stopped-----"

clean : stop
	@echo "----Cleaning all Docker----"
	@containers=$$(docker ps -qa); \
	if [ -n "$$containers" ]; then \
		docker stop $$containers; \
		docker rm $$containers; \
	else \
		echo "No containers to stop and remove."; \
	fi
	@images=$$(docker images -qa); \
	if [ -n "$$images" ]; then \
		docker rmi -f $$images; \
	else \
		echo "No images to remove."; \
	fi
	@echo "----All Docker cleaned-----"

fclean : clean
	@echo "----Full Cleaning all Docker----"
	@volumes=$$(docker volume ls -q); \
	if [ -n "$$volumes" ]; then \
		docker volume rm $$volumes; \
	else \
		echo "No volumes to remove."; \
	fi
	@networks=$$(docker network ls --format "{{.Name}}" | grep -Ev "^bridge$$|^host$$|^none$$"); \
	if [ -n "$$networks" ]; then \
		docker network rm $$networks; \
	else \
		echo "No networks to remove."; \
	fi
	docker system prune -a
	@echo "----All Docker fully cleaned-----"

refront :
	@echo "----Restarting Frontend----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart frontend

reback :
	@echo "----Restarting Backend-----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart backend

redata :
	@echo "----Restarting Database----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart database

rebuild :
	@echo "----Rebuilding all Docker----"	
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d --build --no-cache

re : clean rebuild


