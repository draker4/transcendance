# **************************** Makefile Transcendence **************************** #

DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_FILE = ./docker-compose.yml
ENV_FILE = .env

.phony : start down re clean log reback refront redata rebuild cleandata rmvolumes

# *********************************** IP ADDRESS ********************************** #

HOST_IP := $(shell bash ./tools/get_host_ip.sh)
export HOST_IP

# *********************************** RULES ********************************** #

all : start

ip	: write-env-ip start ipAddress

start :
	@echo "----Starting all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d --build
	@echo "----All Docker started-----"

down :
	@echo "----Stopping all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop -t 1
	@echo "----All Docker stopped-----"

rmvolume :
	@echo "----Deleting all Volumes----"
	docker volume rm $$(docker volume ls -q)
	@echo "----All Volumes deleted-----"


clean : down write-env-localhost
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
	rm -rf node_modules
	rm -rf yarn.lock
	rm -rf workspaces/Backend/dist
	rm -rf workspaces/Backend/logs
	rm -rf workspaces/Backend/node_modules
	rm -rf workspaces/Frontend/node_modules
	rm -rf workspaces/Frontend/.next
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

re : clean start

ipAddress:
	@echo "Host IP: $(HOST_IP)"

write-env-ip:
	@if [ -f $(ENV_FILE) ]; then \
		if grep -q "HOST_IP=" $(ENV_FILE); then \
			grep -v "HOST_IP=" $(ENV_FILE) > $(ENV_FILE).tmp; \
			mv $(ENV_FILE).tmp $(ENV_FILE); \
		fi; \
		echo "HOST_IP=$(HOST_IP)" | cat - $(ENV_FILE) > $(ENV_FILE).tmp; \
		mv $(ENV_FILE).tmp $(ENV_FILE); \
		sed -i 's|^REDIRECT_42=.*$$|REDIRECT_42=http://$(HOST_IP):4000/api/auth/42|' $(ENV_FILE); \
		echo "Updated IP address in $(ENV_FILE) file"; \
	else \
		echo "HOST_IP=$(HOST_IP)" >> $(ENV_FILE); \
		echo "REDIRECT_42=http://$(HOST_IP):4000/api/auth/42" >> $(ENV_FILE); \
		echo "Created IP address in $(ENV_FILE) file"; \
	fi

write-env-localhost:
	@if [ -f $(ENV_FILE) ]; then \
		if grep -q "HOST_IP=" $(ENV_FILE); then \
			grep -v "HOST_IP=" $(ENV_FILE) > $(ENV_FILE).tmp; \
			mv $(ENV_FILE).tmp $(ENV_FILE); \
		fi; \
		echo "HOST_IP=localhost" | cat - $(ENV_FILE) > $(ENV_FILE).tmp; \
		mv $(ENV_FILE).tmp $(ENV_FILE); \
		sed -i 's|^REDIRECT_42=.*$$|REDIRECT_42=http://localhost:4000/api/auth/42|' $(ENV_FILE); \
		echo "Updated IP address to localhost in $(ENV_FILE) file"; \
	else \
		echo "HOST_IP=localhost" >> $(ENV_FILE); \
		echo "REDIRECT_42=http://localhost:4000/api/auth/42" >> $(ENV_FILE); \
		echo "Created IP address in $(ENV_FILE) file"; \
	fi


install-deps:
	@echo "----Downloading Project Dependencies----"
	@if [ ! -d "node_modules" ]; then \
		yarn cache clean; \
		yarn install; \
		yarn install --check-files; \
	fi
