const express = require("express")
const sqlite  = require("sqlite")
const bodyParser = require("body-parser")
const app 	  = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

const dbCon = sqlite.open("banco.sqlite", {Promise})

const init = async() => {
    const db = await dbCon
    // await db.run("CREATE TABLE IF NOT EXISTS contatos(id INTEGER PRIMARY KEY, nome TEXT);")
    // await db.run("INSERT INTO contatos(nome) values('Maria');")
}
   
app.get('/', (req, res) => {
    res.send("inicio")
})

// pega da API criada por mim
// app.get('/pessoas', (req, res) => {
//     res.send(JSON.stringify(dados))
// })

// app.get('/pessoas/:id', (req, res) => {
//     let id = req.params.id - 1;
//     let dado = dados[id];

//     if (dados[id]) {
//         res.send(JSON.stringify(dado.id))
//     } else {
//         res.send("Nenhum id associado");
//     }
// })

app.get('/pessoas', async(req, res) => {
    const db = await dbCon
    const dados = await db.all("SELECT * FROM contatos")
    res.send(JSON.stringify(dados))
})

app.get('/pessoas/:id', async (req, res) => {
    const db = await dbCon
    const dados = await db.get(`SELECT * FROM contatos WHERE id = ${req.params.id}`)
    
    if (dados) {
        res.send(JSON.stringify(dados))
    } else {
        res.send("Nenhum id associado");
    }
})

app.delete('/pessoas/:id', async(req, res) => {
    const db = await dbCon
    const dados = await db.get(`DELETE FROM contatos WHERE id = ${req.params.id}`)
    
    res.send("A PESSOA COM ID: " + req.params.id + " FOI DELETADA")
})

app.put('/pessoas/:id', async(req, res) => {
    const teste = req.body
    const { id, nome } = req.body

    const db = await dbCon
    const dados = await db.get(`UPDATE contatos SET nome = '${nome}' WHERE id = ${req.params.id}`)
    
	res.send("OS DADOS DA PESSOA COM ID: " + req.params.id + " FORAM ATUALIZADOS")	
})

app.listen(3000, (err) => {
    if (err) {
        console.log("Erro ao subir o server")
    } else {
        console.log("Server is on port 3000")
    }
})

init()