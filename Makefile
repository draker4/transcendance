DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_FILE = ./Dockers/docker-compose.yml

.phony : start stop re clean log reback refront redata rebuild cleandata

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
	docker rm $$(docker ps -qa)
	docker rmi -f $$(docker images -qa)
	@echo "----All Docker cleaned-----"

fclean : clean
	@echo "----Full Cleaning all Docker----"
	Docker system prune -a
	docker volume rm $(docker volume ls -q)
	docker network rm $$(docker network ls -q)
	@echo "----All Docker full cleaned-----"

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


