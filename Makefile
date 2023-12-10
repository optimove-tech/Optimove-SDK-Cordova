.PHONY: setup
setup:
	brew bundle --file=./Brewfile --quiet --no-lock
	npm install -g cordova

.PHONY: test
test: setup
	bash ./scripts/smoke-test.sh
