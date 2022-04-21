import express from 'express'
export function start() {
    const app = express()
    const port = 3000
    app.use(express.static('JS_alps-drive-project-frontend'))
    app.get('/', (req, res) => {
        res.render('index.html')
    })
    //app.get('/', (req, res) => {
      //  res.send('Hello World Laeti soleil!')
    //})
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
};