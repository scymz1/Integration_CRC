deploy:
	rm -rf node_modules package-lock.json
	npm install
	rm -rf node_modules
	npm start
	git status 
	git add package-lock.json
	echo "deploy successfully"
	git commit -m "deploy successfully"
