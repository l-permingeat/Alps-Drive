import express from 'express'
import * as drive from './drive.js'

//import { append } from 'express/lib/response'
export function start() {
    const app = express()
    const port = 3000
    app.use(express.static('JS_alps-drive-project-frontend'))

    app.get('/', (req, res) => {
        res.render('index.html')
    })

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

    //affiche le contenu des dossiers ou des fichiers
    app.get('/api/drive/:name', (req, res) => {
        console.log("params : ",req);

        drive.listeDeDossiers("")
            .then(content => {
                content.forEach(element => {
                    if (element.name === req.params.name) {
                        //si c'est un dossier, alors on l'ouvre
                        if (element.isFolder) {
                            //res.status(200, { 'Content-Type': 'application/json' });
                            drive.listeDeDossiers(req.params.name)
                                .then(directory => {
                                    res.status(200).json(directory)
                                })
                            //sinon si c'est un fichier on affiche son contenu
                        } else {
                            console.log("chemin",req.params.name);
                            drive.readFile(req.params.name)
                                .then(file => {
                                    res.setHeader('Content-Type', 'application/octet-stream')
                                    res.status(200).send(file)
                                })
                        }
                    }
                })
            })
    })

        //AJouter un élément
        app.post('/api/drive/', (req, res) => {
           // console.log("params post : ",req.query.name);
            drive.addFolder(req.query.name)
            .then(()=> {
                res.status(201).send()
            })
    
           
        })

    

    //affiche les fichiers qu'il y a dans les dossiers
    /*app.get('/api/drive/:name', (req, res) => {
        res.status(200, { 'Content-Type': 'application/json' });
        drive.listeDeDossiers(req.params.name)
            .then(files => res.send(files))
    })*/

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};