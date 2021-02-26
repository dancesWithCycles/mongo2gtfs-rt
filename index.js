/*
Copyright (C) 2021  Stefan Begerad

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const Helmet = require('helmet');
const Compression = require('compression');
const Debug = require('debug')('vehpos');
const Express = require("express");
const Cors = require("cors");
const Https = require('https');
const Fs = require('fs');
const Mongoose = require('./mongooseConnect');
const Location=require('./models/location.js');
const VehPosPb=require('./vehPosPb');

// restrict origin list
let whitelist = [
    'https://localhost',
    'http://localhost',
    'http://localhost:55555'
];

const App=Express();
App.use(Compression()); //Compress all routes
App.use(Helmet());//protect against vulnerabilities
App.use(Cors({
    origin: function(origin, callback){
        // allow requests with no origin
        Debug('origin: '+origin)
        if(!origin){
            return callback(null, true);
        }
        if(whitelist.indexOf(origin) === -1){
            var message = 'The CORS policy for this origin does not allow access from the particular origin: '+origin;
            return callback(new Error(message), false);
        }
        Debug('origin: '+origin+' allowed by cors');
        return callback(null, true);
    }
}));

const PORT=parseInt(process.env.PORT, 10)||42002;
Debug('PORT: '+PORT)

// pass 'app' to 'https' server
if (process.env.NODE_ENV !== 'production') {
    App.listen(PORT);
}else{
    Https.createServer({
        key: Fs.readFileSync('./p'),
        cert: Fs.readFileSync('./f'),
        passphrase: '#lostInGeorgia20'
    }, App)
    .listen(PORT, ()=>Debug('listening on port '+PORT));
}

const db = Mongoose.connection
db.once('open', _ => {
    Debug('Database connected')
})
db.on('error', err => {
    console.error('connection error:', err)
})

//ALL CRUD HANDLERS HERE
//GET == READ
App.get('/vehiclePostions.pb', (req, res) => {
    // read all documents from collection
    Location.find((err,data)=>{
        if(err){
            Debug('err: %s',err)
            throw err
        }
        const locations=VehPosPb(data)
        res.contentType('application/octet-stream')
        res.send(locations);
    })
})
