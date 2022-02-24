const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const uuid = require('uuid');

const app = express();
app.use(express.static('static'));
app.use( express.json());
app.use( express.urlencoded({extended: true}));

app.get('/gastos', (req, res)=>{
    let basegastos = require('./db.json')
    console.log(basegastos)
    let gastos = basegastos.gastos
    res.send({gastos : []})
})

app.get('/roommates', (req, res)=>{
    let basedatos = require('./db.json') 
    console.log(basedatos)
    let roommates = basedatos.roommates  
    res.send({roommate:[]})
})

//para obtener el nuevo usuario roomate// request -> peticion y response -> respuesta
async function nuevo_roomate(){
    const datos = await axios.app.get("https://randomuser.me/")


 // desempaquetar los datos
    const randomuser = datos.data.results[0]  
    const newuser = {
     // generamos el id se utiliza slice para disminuira 30 los caracteres
    id : uuid.v4().slice(30),
    nombre: randomuser.name.firt + ' ' +  randomuser.name.last,
    debe: 0,
    recibe: 0

    }    
    return newuser
}

app.post('/roommate', async (req, res) => {
    console.log('probando ruta')
    let roommate = newroommate()
    console.log(`llego el id: ${roommate.id},  con el nombre de :${roommate.nombre}, el cual debe: ${roommate.debe}`)
    console.log(roommate)

    //leemos el archivo creado
    let db = await fs.readFile('db.json','utf-8')
    
    //transforma de un string a un objeto
    db = JSON.parse(db)
    
    //enviamos la informacion a la base de datos
    db.roomate.push(roommate)

    console.log(db)

    //finalmente guardo el nuevo usuario
    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8')
    res.send({todo:'ok'})

});

app.post('/gasto', async (req, res) => {
    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });
    req.on('end', async() => {
        body.id = uuid.v4(),
        
        // leemos el archivo creado
        let db = await fs.readFile('db.json', "utf-8")
        //transformando de un string a un objeto
        db = JSON.parse(db)
        // enviamos la informacion  a la base de datos
        db.gastos.push(body)
        // finalmente guardo el nuevo usuario
        await fs.writeFile('db.json', JSON.stringify(db), "utf8") 

        res.send({todo: 'OK'});
    });
});


app.listen(3000, function() { console.log("Servidor andando en el puerto numero 3000");});

/*1) Crear el molde del proyecto (server.js, static, NPM install)
2) Colocar el index.html del apoyo, en la carpeta static
3) Crear el db.js para guardar los roommates y los gastos
4) Implementar las rutas 
* /roommate POST: Almacena un nuevo roommate ocupando random user.
● /roommate GET: Devuelve todos los roommates almacenados.
- /gastos GET: Devuelve todos los gastos almacenados*/