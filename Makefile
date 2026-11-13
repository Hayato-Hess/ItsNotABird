.PHONY: build start clean

node_modules: package.json
	npm install
	@touch node_modules

build: node_modules
	npx tsc
	npx tsc -p src/client
	npx vite build

start: build
	node dist/server/server.js

clean:
	rm -rf dist node_modules
