const express = require ("express")
const fs =require("fs")
const port = 4900
const server=express()
server.use(express.json())
server.get("/",(req,res)=>{
    res.status (200).json({
        message:"welcome to my contact page"
    })
})

// READING  contacts IN THE DATABASE
const readData=(req,res)=>{
    const database=   fs.readFileSync("./contact.json")
    return JSON.parse(database)
   
   }

const writeDB=(data)=>{
 fs.writeFileSync("./database.json",JSON.stringify(data,null,2))
}
   server.get("/contacts",(req,res)=>{
    const  contact =readData()
    if(!contact.length===0){
        res.status(404).json({
            message:"Empty!!"
        })
    }else{
        res.status(200).json({
            message:"OK",
            data:contact,
            total:contact.length,
        })
       
    }
   })
//    GETTING A PARTICULAR CONTACT BY ID 
   server.get("/contacts/:id",(req,res)=>{
    const database =readData()
    const contactId = parseInt(req.params.id)
    const contact =database.contactList.find((l)=>(l.id===contactId))
    if(!contact){
        res.status(404).json({
            message:"contact  not found"
        })
    }else{
        res.status(200).json({
            status:"success",
            data:contact
        })
    }
})
server.post("/contacts",(req,res)=>{
    const database=readData()
    const newContact =req.body
    newContact.id = database.contactList.length +1
    database.contactList.push(newContact)
    writeDB(database)
    res.status(201).json({
        newData:newContact
    })
 


})
server.put("/contacts/:id",(req,res)=>{
    const database=readData()
const contactId = parseInt(req.params.id)
const updatedcontact = req.body 
const index=database.contactList.findIndex((i)=>(i.id===contactId))
if(index!==-1){
    database.contactList[index]={...database.contactList[index],...updatedcontact}
    writeDB(database)
    res.status(200).json({
        data:database.contactList[index]
    })
}else{
    res.send("wrong id sent.")
}

})
server.delete("/contacts/:id",(req,res)=>{
    const database = readData()
    const contactId= parseInt(req.params.id)
    const index =database.contactList.find((i)=>(i.id=== contactId))
    if(!database.contactList[0]){
        res.status(404).json({
            message:`this id:${contactId}does not exist`
        })
    }else{
        deletedContact= database.contactList[index]
        database.contactList.splice(index,1)
        writeDB(database)
        res.status(200).json({
            deletedContact:deletedContact
        })
    }
})


server.listen(port,()=>{
    console.log (`working on port ${port}`)
})