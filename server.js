import express from 'express'
import { fstat } from 'fs'
import * as drive from './drive.js'

//import { append } from 'express/lib/response'
export function start() {
    const app = express()
    const port = 3000
    app.use(express.static('JS_alps-drive-project-frontend'))

    app.get('/', (req, res) => {
        res.render('index.html')
    })
    /*  app.get('/api/drive', (req, res) => {
          res.writeHead(200, {
              'content-type': 'application/json'
          });
          res.send([
              {
                  name: "Personnel",
                  isFolder: true,
              },
              {
                  name: "Avis imposition",
                  size: 1337,
                  isFolder: false
              }
          ])
  
      })*/


    //affiche les dossiers
    app.get('/api/drive', (req, res) => {
        res.status(200, { 'Content-Type': 'application/json' });
        drive.listeDeDossiers("")
            .then(files => { 
                console.log(files);
                res.send(files) 
            })
        //.then(files => res.status(200).json(files))
    })

    //affiche les fichiers qu'il y a dans les dossiers
    app.get('/api/drive/:name', (req, res) => {
        res.status(200, { 'Content-Type': 'application/json' });
        drive.listeDeDossiers(req.params.name)
            .then(files => res.send(files))
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};