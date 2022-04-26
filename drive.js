import os from 'os'
import fs from 'fs/promises'
import { join } from 'path'

const DRIVE_ROOT = join(
    os.tmpdir(),
    'back'
)

console.log("Dossier racine du AlpsDrive: ", DRIVE_ROOT);


export function listeDeDossiers(path) {
    const concatenatedPath = join(DRIVE_ROOT, path)
    console.log(concatenatedPath);

    return fs.readdir(concatenatedPath, { withFileTypes: true })
        //J'attends que toutes mes promesses soient terminées
        .then(direntItems => Promise.all(direntItemsToFiles(direntItems, concatenatedPath)))
        //Je retourne mes promesses, arrayDatas correspond à response, 
        //la réponse du then
        .then(arrayDatas => arrayDatas)
}

export function readFile(path) {
    const concatenatedPath = join(DRIVE_ROOT, path);
    return fs.readFile(concatenatedPath);

}

//retourne les infos sur mes éléments
export function direntItemsToFiles(direntItems, path) {
    return direntItems.map(direntItem => {
        console.log(direntItems);
        //Je regarde si mon item est un dossier
        if (direntItem.isDirectory() === true) {

            let fileObject = {
                name: direntItem.name,
                isFolder: direntItem.isDirectory(),
            }
            return fileObject

            //s'il est pas un dossier
        } else {
            return fs.stat(path)
                .then(objStats => {
                    console.log("la réponse", objStats);
                    const fileObject = {
                        name: direntItem.name,
                        isFolder: direntItem.isDirectory(),
                        size: objStats.size
                    }
                    return fileObject
                })
        }
    })
}

//Création d'un dossier
export function addFolder(path) {
    const concatenatedPath = join(DRIVE_ROOT, path)
    return fs.mkdir(concatenatedPath)
        .catch(console.log("Il y a une erreure"))
}


