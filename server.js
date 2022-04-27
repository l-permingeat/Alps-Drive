import express from 'express'
import * as drive from './drive.js'
import fileUpload from 'express-fileupload'
//import bb from 'express-busboy'

export function start() {
    const app = express()
    const port = 3000
    app.use(express.static('JS_alps-drive-project-frontend'))

    app.use(fileUpload({
        createParentPath: true
    }));

    app.get('/', (req, res) => {
        res.render('index.html')
    })

    /*  bb.extend(app,{
          upload: true,
              path : drive.DRIVE_ROOT,
                  allowPath : / . /
  
      });*/

    //affiche les élément à la racine
    app.get('/api/drive', (req, res) => {
        drive.listeDeDossiers("")
            .then(files => {
                //   console.log(files);
                res.status(200, { 'Content-Type': 'application/json' }).send(files)
            })
    })

    //affiche le contenu des dossiers ou des fichiers
    app.get('/api/drive/:name', (req, res) => {
        //console.log("params : ", req);

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
                            // console.log("chemin", req.params.name);
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
        drive.deleteItem("", req.params.name, res)
            .then(() => {
                res.status(201).send()
            })
            .catch((error) => {
                res.status(400).send(error.message)
            })
    })

    //Supprimer un élément dans un dossier
    app.delete('/api/drive/:folder/:name', (req, res) => {
        drive.deleteItem(req.params.folder, req.params.name, res)
            .then(() => {
                res.status(201).send()
            })
            .catch((error) => {
                res.status(400).send(error.message)
            })
    })

    //ajouter un fichier à la racine du drive
    app.put('/api/drive/', (req, res) => {
        //je stock dans une variable l'objet req.files.file
        //le file correspond au nom de l'id de mon input
        let file = req.files.file;
        //console.log("FILE :", file);
        //console.log("name fichier", file.name);
        drive.addFile(res, file)
            .then(() => {
                res.status(201).send()
            })
    })

    //ajouter un fichier dans un dossier
    app.put('/api/drive/:name', (req, res) => {
        //je stock dans une variable l'objet req.files.file
        //le file correspond au nom de l'id de mon input
        let file = req.files.file;
        //console.log("FILE :", file);
        //console.log("name fichier", file.name);
        drive.addFile(res, req.params.name, file)
            .then(() => {
                res.status(201).send()
            })
    })

    //indique sur quel port on veut travailler/écouter notre projet
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};