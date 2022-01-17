const express = require("express");
const cors = require("cors")
const multer = require("multer")
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors("*"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/*
  Stock l'image sur le server dans le dossier prévut
  /!\ 
  Il faut créer le dossier, multer ne créer pas le dossier si il n'éxiste pas 
  /!\
*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/') // Définit le dossier ou placer les fichiers
  },
  filename: function (req, file, cb) {
    /*
      Permet de récuperer l'extension du fichier
    */
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];
    /*
      Créer le nom du fichier en lui rajoutant sa date d'écriture sur le server ainsi que son extension de fichier
    */
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9 ) + '.' + extension
    cb(null, file.fieldname + '-' + uniqueSuffix)
    req.body.fileName = file.fieldname + '-' + uniqueSuffix //Rajoute une propriété au body pour lui donner le nom du fichier créé
  } 
})

const upload = multer({ storage: storage })

app.post('/users', upload.single('CV'), (req,res) => {
  console.log(req.body)
  res.status(201).json(req.body)
})



app.listen(PORT, () => {
  console.log(`Server up & running on : ${PORT}`)
})