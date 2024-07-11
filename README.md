## Team Three
##### Manager: Mariana Jaramillo
##### Anh Pham, Jerry Du, Jonathan Coombs, Omar Natour, Rakeb Tewodros, Sapphire Tham
### Code Overview
The project is split into two folders, react-app is our front end, and server is our backend

### Installation
```
You will need to open two terminals simultaneously, one for back end and one for the front end.

Install the packages on your machine.
```
npm install
```
For testing purposes, create a .env file in the server folder with this: 
MONGO_URI=mongodb+srv://acpham:p1gaBUKefs0nqRca@rattiganreview.x9ag4wu.mongodb.net/
ACCESS_TOKEN_SECRET=379e470ee967867c65ba38d2f5b6350355bf2650dd94d0da70c0732e9cce1238
REFRESH_TOKEN_SECRET=cf249e04063f8233559e7c4b93bc36c16a623ec528e593128213389916c2c745

then start the back end services using the command...
```
node app.js
```
You will then need to go into your second terminal.
Navigate to MovieSearch/react-app
Again, install packages on your machine
```
npm install
```
Finally start the front end using the command...
```
npm run start
```
navigate to <http://localhost:3000> to access the webpage.


The TMDB API is heavily used in this project
```
https://developer.themoviedb.org/docs/getting-started
```


