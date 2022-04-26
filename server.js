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

    //affiche les élément à la racine
    app.get('/api/drive', (req, res) => {
        //res.status(200, { 'Content-Type': 'application/json' });
        drive.listeDeDossiers("")
            .then(files => {
                console.log(files);
                res.status(200).send(files)
            })
        //.then(files => res.status(200).json(files))
    })

    //affiche le contenu des dossiers ou des fichiers
    app.get('/api/drive/:name', (req, res) => {
        console.log("params : ", req);

        drive.listeDeDossiers("")
            .then(content => {
                content.forEach(element => {
                    if (element.name === req.params.name) {
                        //si c'est un dossier, alors on l'ouvre
                        if (element.isFolder) {
                            drive.listeDeDossiers(req.params.name)
                                .then(directory => {
                                    res.status(200).json(directory)
                                })
                            //sinon si c'est un fichier on le télécharge
                        } else {
                            console.log("chemin", req.params.name);
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


    /*else {
        console.log("Le name demandé n'existe pas");
        return res.status(404).send("Le name demandé n'existe pas")

    }*/

    //Ajouter un élément
    app.post('/api/drive/', (req, res) => {
        // console.log("params post : ",req.query.name);
        drive.addDirectory(req.query.name, res)
            .then(() => {
                res.status(201).send()
            })
            .catch(() => {
                res.status(400).send("erreur")
            })
    })

    //Ajouter un élément dans un dossier déja existant
    app.post('/api/drive/:name', (req, res) => {
        // console.log("params post : ",req.query.name);
        drive.addDirectory(req.query.name, res, req.params.name)
            .then(() => {
                res.status(201).send()
            })
            .catch((error) => {
                res.status(400).send(error.message)
            })
    })

    //Supprimer un élément
    app.delete('/api/drive/:name', (req, res) => {
        drive.deleteItem(req.params.name, res)
            .then(() => {
                res.status(201).send()
            })
            .catch((error) => {
                res.status(400).send(error.message)
            })
    })

    //Supprimer un élément dans un dossier
    app.delete('/api/drive/:folder/:name', (req, res) => {
        drive.deleteItem( req.params.name, res)
            .then(() => {
                res.status(201).send()
            })
            .catch((error) => {
                res.status(400).send(error.message)
            })
    })




    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};