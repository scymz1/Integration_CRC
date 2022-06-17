# Integ_CRC_Jun_7
# Integ_CRC_Jun_7
[![](https://img.shields.io/badge/npm-v8.11.0-brightgreen)](https://shields.io)  [![](https://img.shields.io/badge/node-v16.15.1-orange)](https://shields.io)
Heroku Link: [Heroku]()
OCI Deployment Link: [OCI]()

The branch we except to deploy is: **production**

**Deploy Problem Solution && Wordflow**
Since we found `package-lock.json` will casuse `OCI` deployment process error, we summarized a workflow to avoid that:

1. use nvm (Node version management) tool make sure node -version is "correct <same version everybody>"
    1.1: Check your local node version by `node -v` and npm version with `npm -v`
    1.2: Make sure the versions are same as top of this README

2. Delete `node_modules` && `package-lock.json` file
3. npm install
4. Delte `node_modules` 
5. npm ci 
6. Locally test 
7. If funciton on local serve is perfect then push & merge

### How it run on localhost:
**1. Clone the project to local**

```
git clone [project link]
```

**2. Run `npm install`** 
It installs all the packages that project need. If install process failed, you clould check as follows:

**React-Route**
```javaScript
npm install --save react-router-dom
```

**React-Plotly**
```javaScript
npm install react-plotly.js plotly.js
```

**Axios**
```javaScript
npm install axios
```

**dotenv**
```javaScript
npm install dotenv
```

**Material UI**
```javaScript
npm install @mui/material @emotion/react @emotion/styled
```

**3. Authorization**
In the `.env`, you could change `REACT_APP_AUTHTOKEN` 

**4. Run Application**
```javaScript
npm start
```



------
### Deployment on Heroku
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

**Configiration Process**
```shell
# View current config var values
heroku config
# Example:
# GITHUB_USERNAME: Jiran
# REACT_APP_AUTHTOKEN: 'Token asdbchuawjfv112baisuyofgkue'    
# REACT_APP_BASEURL: https://voyages3-api.crc.rice.edu
```

```shell
# Set all config vars example:
heroku config:set GITHUB_USERNAME=joesmith
heroku config:set REACT_APP_AUTHTOKEN='Token asdbchuawjfv112baisuyofgkue'   
heroku config:set REACT_APP_BASEURL='https://voyages3-api.crc.rice.edu'
```
```shell
# Remove config vars example:
heroku config:unset GITHUB_USERNAME
```


### Heroku deploy fail problems in group.
1. FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
2. Some problems revelant to `package-lock.json`. For example: npm ERR! Missing: typescript@4.7.3 from lock file

--------
### Code Structure 
```
.
├── Component
│   ├── HomePage
│   ├── VoyagePage
│   │   ├── Filter
│   │   │   ├── ComponentFactory
│   │   │   └── Menu.js
│   │   ├── Result
│   │   │   ├── Table.js ...
│   │   │   └── Pie.js
│   │   └── Voyage.js (with SideBar)
│   ├── PastPage
│   ├── NavBar.js
|   └─ App.js
└── index.js
```
------
### Potential Problem 

