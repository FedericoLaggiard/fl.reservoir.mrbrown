/**
 * Created by federicolaggiard on 06/10/16.
 */
'use strict';
const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const os = require('os');
const junk = require('junk');
const hidefile = require('hidefile');
const cors = require('cors');
const drivelist = require('drivelist');

var app = express();
var dir = os.homedir();//process.cwd();

app.use(express.static(dir)); //cur working dir
app.use(express.static(__dirname)); //module dir
app.use(cors());

app.get('/', function ( req, res, next ) {
  // uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
  //if (/\/[^.]*$/.test(req.url)) {
    res.sendfile(__dirname + '/fe/index.html');
  //} else {
  //  next();
  //}
});

app.get('/files', function (req,res){

  var currentDir = dir;
  var query = req.query.path || 'drives';

  if(query) currentDir = path.join(query);
  console.log('browsing ' + currentDir);

  if(query === 'drives'){
    drivelist.list(function(error,drives){
      if (error) throw error;

      var d = [];
      drives.map(function(drive){
        if(drive.mountpoint)
          d.push({
            path: drive.mountpoint,
            name: drive.mountpoint
          })
      })

      var data = {
        files: [],
        directories: d
      };

      res.json(data);
    })
  }else{
    fs.readdir(currentDir, function(err,files){
      if(err) throw err;

      var data = {
        files: [],
        directories: []
      };
      files = files.filter(junk.not);
      files.forEach(function (file) {

        try{

          var p = path.join(currentDir,file);
          if(hidefile.isHiddenSync(p)) return;

          var isDirectory = fs.statSync(p).isDirectory();

          var f = {
            name: file,
            path: path.join(query, file)
          };

          if(isDirectory) {
            data.directories.push(f);
          }else{
            var ext = path.extname(file);
            //if(program.exclude && _.contains(program.exclude, ext)){
            //  console.log('excluding file ', file);
            //  return;
            //}
            f.ext = ext;
            data.files.push(f);
          }

        }catch(e){
          console.log(e);
        }

      });

      //data = _.sortBy(data,function(f){return f.name;});

      res.json(data);

    });
  }



});


var server = http.createServer(app);

server.listen('8081','0.0.0.0');

