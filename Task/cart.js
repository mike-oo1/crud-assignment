const express= require ("express")
const fs =require("fs")
const port = 6900
const server =express()
server.use(express.json())
server.get("/",(req,res)=>{
    res.status(200).json({
        message:"welcome to my new service"
    })
})



const readData=(req,res)=>{
    const database=   fs.readFileSync("./cart.json")
    return JSON.parse(database)
   
   }
   const writeDB=(data)=>{
    fs.writeFileSync("./cart.json",JSON.stringify(data,null,2))
}
server.get("/cartitems",(req,res)=>{
    const  carts =readData()
    if(!carts.length===0){
        res.status(404).json({
            message:"Empty!!"
        })
    }else{
        res.status(200).json({
            message:"OK",
            data:carts,
            total:carts.length,
        })
       
    }
   })

   server.get("/carts/:id",(req,res)=>{
    const database =readData()
    const cartsId = parseInt(req.params.id)
    const carts =database.cartItems.find((l)=>(l.id===cartsId))
    if(!carts){
        res.status(404).json({
            message:" OOPPS!!employee not found"
        })
    }else{
        res.status(200).json({
            status:"success",
            data:carts
        })
    }
})

server.post("/carts",(req,res)=>{
    const database=readData()
    const newCart=req.body
    newCart.id = database.cartItems.length +1
    database.cartItems.push(newCart)
    writeDB(database)
    res.status(201).json({
        newData:newCart
    })
 

})

server.put("/carts/:id",(req,res)=>{
    const database=readData()
const cartId = parseInt(req.params.id)
const updatedCarts = req.body 
const index=database.cartItems.findIndex((i)=>(i.id===cartId))
if(index!==-1){
    database.cartItems[index]={...database.cartItems[index],...updatedCarts}
    writeDB(database)
    res.status(200).json({
        data:database.cartItems[index]
    })
}else{
    res.send("wrong id sent.")
}
})


server.delete("/carts/:id",(req,res)=>{
    const database = readData()
    const cartId= parseInt(req.params.id)
    const index =database.cartItems.find((i)=>(i.id=== cartId))
    if(!database.cartItems[0]){
        res.status(404).json({
            message:`this id:${cartId}does not exist`
        })
    }else{
        deletedCart= database.cartItems[index]
        database.cartItems.splice(index,1)
        writeDB(database)
        res.status(200).json({
            deletedCart:deletedCart
        })
    }
})


server.listen(port,()=>{
    console.log(`working on port ${port}`)

})