# Integ_CRC_Jun_7
[Heroku](https://pure-falls-53650.herokuapp.com/)

### How to deploy on Heroku
**Deployment Process:**
```shell
git clone [this project]
```
```shell
cd [this project]
```
```shell
git init 
```
```shell
heroku create -b https://github.com/mars/create-react-app-buildpack.git
```

```shell
# Configiration Process
# For more detials, check https://devcenter.heroku.com/articles/config-vars

git add .
```

```
git commit -m "React Projct is deployed on Heroku"
```
```
git push heroku master
```
```
heroku open
```

### Heroku deploy fail problems
1. FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
2. Some problems revelant to `package-lock.json`. For example: npm ERR! Missing: typescript@4.7.3 from lock file

