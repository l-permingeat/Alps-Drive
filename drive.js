import os from 'os'
import fs from 'fs/promises'
import { join } from 'path'
import { response } from 'express';

const DRIVE_ROOT = join(
    os.tmpdir(),
    'back'
)

console.log("Dossier racine du AlpsDrive: ", DRIVE_ROOT);


export function listeDeDossiers(path) {
    const folder = join(DRIVE_ROOT, path)
    console.log(folder);

    return fs.readdir(folder, { withFileTypes: true })
    //J'attends que toutes mes promesses soient terminées
        .then(direntItems => Promise.all(direntItemsToFiles(direntItems,folder)))
        //Je retourne mes promesses, arrayDatas correspond à response, 
        //la réponse du then
        .then(arrayDatas=>arrayDatas)

}


//retourne les infos sur mes éléments
export function direntItemsToFiles(direntItems, path) {
    return direntItems.map(direntItem => {
        console.log(direntItems);
        //Je regarde si mon item est un dossier
        if (direntItem.isDirectory() == true) {

            let fileObject = {
                name: direntItem.name,
                isFolder: direntItem.isDirectory(),
            }
            return fileObject

//s'il est pas un dossier
        } else {
            return fs.stat(path)
                .then(objStats => {
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



