.env:
	if [ ! -f ./dummycerts/id_rsa ]; then \
		mkdir -p dummycerts; \
		ssh-keygen -t rsa -q -N "" -f dummycerts/id_rsa; \
	fi
	echo "export RESPITEPRIVKEY=\"$$(cat dummycerts/id_rsa)\"" > .env
	echo "export RESPITEPUBKEY=\"$$(cat dummycerts/id_rsa.pub)\"" >> .env
	echo "export DEV_MODE=true" >> .env

.PHONY: test
test: 
	docker-compose up -d
	sleep 5
	docker-compose -f test/docker-compose.yml up

.PHONY: build
build:
	docker-compose build

.PHONY: clean
clean:
	rm -rf dummycerts
	rm .env
