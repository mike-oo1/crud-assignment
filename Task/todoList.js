const express= require ("express")
const fs =require("fs")
const port = 3900
const server =express()
server.use(express.json())
server.get("/",(req,res)=>{
    res.status(200).json({
        message:"welcome to my new service"
    })
})

// READING  todo IN THE DATABASE
const readData=(req,res)=>{
    const database=   fs.readFileSync("./database.json")
    return JSON.parse(database)
   
   }
   const writeDB=(data)=>{
    fs.writeFileSync("./database.json",JSON.stringify(data,null,2))
}

server.get("/lists",(req,res)=>{
 const  list =readData()
 if(!list.length===0){
     res.status(404).json({
         message:"Empty!!"
     })
 }else{
     res.status(200).json({
         message:"OK",
         data:list,
         total:list.length,
     })
    
 }
})
// getting a particular todo by id
server.get("/lists/:id",(req,res)=>{
    const database =readData()
    const listId = parseInt(req.params.id)
    const list =database.todoList.find((l)=>(l.id===listId))
    if(!list){
        res.status(404).json({
            message:"user not found"
        })
    }else{
        res.status(200).json({
            status:"success",
            data:list
        })
    }
})
// creating a new todo 
server.post("/lists",(req,res)=>{
    const database=readData()
    const newTodo =req.body
    newTodo.id = database.todoList.length +1
    database.todoList.push(newTodo)
    writeDB(database)
    res.status(201).json({
        newData:newTodo
    })
 


})
// updating a todo 
server.put("/lists/:id",(req,res)=>{
    const database=readData()
const listId = parseInt(req.params.id)
const updatedTodo = req.body 
const index=database.todoList.findIndex((i)=>(i.id===listId))
if(index!==-1){
    database.todoList[index]={...database.todoList[index],...updatedTodo}
    writeDB(database)
    res.status(200).json({
        data:database.todoList[index]
    })
}else{
    res.send("wrong id sent.")
}

})
// deleting a todo by id 
server.delete("/lists/:id",(req,res)=>{
    const database = readData()
    const listId= parseInt(req.params.id)
    const index =database.todoList.find((i)=>(i.id=== listId))
    if(!database.todoList[0]){
        res.status(404).json({
            message:`this id:${userId}does not exist`
        })
    }else{
        deletedTodo= database.todoList[index]
        database.todoList.splice(index,1)
        writeDB(database)
        res.status(200).json({
            deletedTodo:deletedTodo
        })
    }
})

   server.listen(port,()=>{
    console.log(`port is listening to port ${port}`)
   })