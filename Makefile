.PHONY: build start dev clean exe

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

# Windows single executable (Node SEA), built entirely on Linux/WSL.
# The blob must come from the same Node version as the embedded node.exe,
# so we download the Windows binary matching the local `node --version`.
NODE_VERSION := $(shell node --version)
SEA_DIR := dist/sea
EXE := dist/its-not-a-bird.exe

exe: build
	mkdir -p $(SEA_DIR)
	npx esbuild dist/server/server.js --bundle --platform=node --format=cjs \
		--external:bufferutil --external:utf-8-validate \
		--log-override:empty-import-meta=silent \
		--outfile=$(SEA_DIR)/server.cjs
	node scripts/sea-config.mjs dist/client $(SEA_DIR)/server.cjs $(SEA_DIR)/sea-prep.blob $(SEA_DIR)/sea-config.json
	node --experimental-sea-config $(SEA_DIR)/sea-config.json
	test -f $(SEA_DIR)/node-$(NODE_VERSION).exe || \
		curl -fsSL -o $(SEA_DIR)/node-$(NODE_VERSION).exe https://nodejs.org/dist/$(NODE_VERSION)/win-x64/node.exe
	cp $(SEA_DIR)/node-$(NODE_VERSION).exe $(EXE)
	chmod +x $(EXE)
	npx postject $(EXE) NODE_SEA_BLOB $(SEA_DIR)/sea-prep.blob \
		--sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
	@echo "Built $(EXE)"

clean:
	rm -rf dist node_modules
