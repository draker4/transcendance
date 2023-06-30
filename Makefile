# **************************** Makefile Transcendence **************************** #

DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_FILE = ./Dockers/docker-compose.yml

.phony : start down re clean log reback refront redata rebuild cleandata rmvolumes

# *********************************** IP ADDRESS ********************************** #

HOST_IP := $(shell bash ./tools/get_host_ip.sh)
export HOST_IP

# *********************************** RULES ********************************** #

all : start

ip	: write-env-ip start ipAddress write-env-localhost

start :
	@echo "----Starting all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d --build
	@echo "----All Docker started-----"

down :
	@echo "----Stopping all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down
	@echo "----All Docker stopped-----"

rmvolume :
	@echo "----Deleting all Volumes----"
	docker volume rm $$(docker volume ls -q)
	@echo "----All Volumes deleted-----"


clean : down
	@echo "----Cleaning all Docker----"
	@containers=$$(docker ps -qa); \
	if [ "$$containers" ]; then \
		docker rm $$containers; \
	else \
		echo "No containers to remove."; \
	fi
	@images=$$(docker images -qa); \
	if [ "$$images" ]; then \
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
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d --build


re : clean rebuild

ipAddress:
	@echo "Host IP: $(HOST_IP)"

write-env-ip:
	@if [ -f ./Dockers/.env ] && grep -q "HOST_IP=" ./Dockers/.env; then \
		sed -i 's/HOST_IP=.*/HOST_IP=$(HOST_IP)/' ./Dockers/.env; \
		echo "Updated IP address in ./Dockers/.env file"; \
	else \
		echo "HOST_IP=$(HOST_IP)" >> ./Dockers/.env; \
		echo "Created IP address in ./Dockers/.env file"; \
	fi

write-env-localhost:
	@if [ -f ./Dockers/.env ] && grep -q "HOST_IP=" ./Dockers/.env; then \
		sed -i 's/HOST_IP=.*/HOST_IP=localhost/' ./Dockers/.env; \
		echo "Updated IP address in ./Dockers/.env file"; \
	else \
		echo "HOST_IP=localhost" >> ./Dockers/.env; \
		echo "Created IP address in ./Dockers/.env file"; \
	fi
