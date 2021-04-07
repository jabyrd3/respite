.env:
	if [ ! -f ./dummycerts/id_rsa ]; then \
		mkdir -p dummycerts; \
		ssh-keygen -t rsa -q -N "" -f dummycerts/id_rsa; \
	fi
	echo "export RESPITEPRIVKEY=\"$$(cat dummycerts/id_rsa)\"" > .env
	echo "export RESPITEPUBKEY=\"$$(cat dummycerts/id_rsa.pub)\"" >> .env


.PHONY: build
build:
	docker-compose build

.PHONY: clean
clean:
	rm -rf dummycerts
	rm .env
