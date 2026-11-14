.PHONY: build start dev clean

node_modules: package.json
	npm install
	@touch node_modules

build: node_modules
	npx tsc
	npx tsc -p src/client
	npx vite build

start: build
	node dist/server/server.js

# Dev mode: Vite (HMR for the client) + tsc --watch / node --watch for the server.
# Open the Vite URL (http://localhost:5173); /socket.io is proxied to the server.
dev: node_modules
	./node_modules/.bin/tsc
	@trap 'kill $$TSC $$SRV 2>/dev/null' INT TERM EXIT; \
	./node_modules/.bin/tsc --watch --preserveWatchOutput & TSC=$$!; \
	node --watch dist/server/server.js & SRV=$$!; \
	./node_modules/.bin/vite

clean:
	rm -rf dist node_modules
