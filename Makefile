.PHONY: setup
setup:
	npm install -g cordova

.PHONY: test
test: setup
	bash ./scripts/smoke-test.sh
