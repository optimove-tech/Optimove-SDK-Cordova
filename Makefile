test_app_name = ExampleApp

.PHONY: setup
setup:
	npm install -g cordova

.PHONY: build
build: setup
	bash ./scripts/build.sh $(test_app_name)

.PHONY: clean
clean:
	rm -rf ./$(test_app_name)/node_modules
	rm -rf ./$(test_app_name)/platforms
	rm -rf ./$(test_app_name)/plugins

.PHONY: all
all: clean build