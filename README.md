# Integ_CRC_Jun_7
[Heroku](https://pure-falls-53650.herokuapp.com/)

### How to deploy on Heroku
```shell
git clone git@github.com:ZhihaoWan/Integ_CRC_Jun_7.git
```
```shell
cd Integ_CRC_Jun_7
```
```shell
heroku create -b https://github.com/mars/create-react-app-buildpack.git
```
```shell
heroku open
```
### Heroku deploy fail problems
1. FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
2. Some problems revelant to `package-lock.json`. For example: npm ERR! Missing: typescript@4.7.3 from lock file

