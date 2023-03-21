const express = require('express');
const app = express()

//duong dan den database
const url = 'mongodb+srv://tommy:12345654321@cluster0.lkrga.mongodb.net/test'
//import thu vien MongoDB
const MongoClient = require('mongodb').MongoClient;

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/addProduct',(req,res)=>{
    res.render('addProduct')
})
app.post('/addProduct',async (req,res)=>{
    console.log(req.body)
    const name = req.body.txtName
    const price = Number.parseFloat(req.body.txtPrice)
    //kiem tra du lieu hop le truoc khi add
    if(name.length <5){
        res.render('addProduct',{nameError: 'Ten phai lon hon 4 ky tu!'})
        return
    }
    const firstCharacter = name.substring(0,1)
    if(!((firstCharacter == 'p') || (firstCharacter == 'b'))){
        res.render('addProduct',{nameError: 'phai bat dau bang p hoac b'})
        return
    }
    await addProduct(name,price)
    res.redirect('/')

})
async function addProduct(name,price){
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database GCH1006
    let dbo = client.db("GCH1006")
    //3.insert vao collection(table) product
    return await dbo.collection("products").insertOne({'name':name,'price': price})
}

app.get('/findAll',async (req,res)=>{
    //tim all trong database
    const results = await findAllProduct()
    //hien thi trong view
    res.render('view',{'results':results})
})

async function findAllProduct(){
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database GCH1006
    let dbo = client.db("GCH1006")
    //3. return all products
    return await dbo.collection('products').find({}).toArray()
}
app.get('/delete/:id',async (req,res)=>{
    //vd id: 641278ff496eca772d08460f
    const id = req.params.id
    await deleteProduct(id)
    res.redirect('/')
})
async function deleteProduct(id){
     //1.ket noi den database server voi dia chi la url
     let client = await MongoClient.connect(url);
     //2.truy cap database GCH1006
     let dbo = client.db("GCH1006")
     //xoa 
     var ObjectId = require('mongodb').ObjectId
     await dbo.collection('products').deleteOne({_id: new ObjectId(id)})
}

const PORT =process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log('server is up at ' + PORT)
})
