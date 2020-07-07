//Configurando o servidor
const express = require('express')
const app = express();


//Configurar o servidor para apresentar arquivos extras
app.use(express.static('public'))

//Habilitando o body e muitas outras coisinhas ;) do formulário
app.use(express.urlencoded({extended:true}))

//Configurando a conexão com banco de dados
const Pool = require('pg').Pool 
const db = new Pool({
    user:'postgres',
    password:'123akali321',
    host:'localhost',
    port:5432,
    database: 'doe'
})

//Configurando o template engine
const nunjucks = require('nunjucks')
const query = `INSERT INTO donors("name", "email", "blood") VALUES ($1, $2, $3)`
nunjucks.configure('./', {
    express:app,
    noCache : true,
})

//Lista de doadores
let donor = {}

//Configurar a apresentação da página
app.get('/', function(req ,res){

    db.query('SELECT * FROM donors ', function(err, result){
        if(err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render('index.html', {donors})
    } )

})

app.post('/', function(req,res){
    
    let donor = {name : req.body.name, email : req.body.email, blood : req.body.blood} 
    let values = [donor.name, donor.email, donor.blood]

    if(donor.name == "" || donor.email == "" || donor.blood == ""){
        window.alert("Olá")
        return res.send("Todos os campos devem ser preenchidos")
    }   

    db.query( query, values, function(err){
        if(err) return res.send("Erro no banco de dados")
        return res.redirect('/')

    })
   
})

app.listen(3001, function(){
    console.log("Servidor iniciado na porta 3001")
})