const express= require ("express")
const fs =require("fs")
const port = 5900
const server =express()
server.use(express.json())
server.get("/",(req,res)=>{
    res.status(200).json({
        message:"welcome to my new service"
    })
})



const readData=(req,res)=>{
    const database=   fs.readFileSync("./employee.json")
    return JSON.parse(database)
   
   }
   const writeDB=(data)=>{
    fs.writeFileSync("./employee.json",JSON.stringify(data,null,2))
}
server.get("/records",(req,res)=>{
    const  records =readData()
    if(!records.length===0){
        res.status(404).json({
            message:"Empty!!"
        })
    }else{
        res.status(200).json({
            message:"OK",
            data:records,
            total:records.length,
        })
       
    }
   })
   server.get("/records/:id",(req,res)=>{
    const database =readData()
    const recordId = parseInt(req.params.id)
    const records =database.employeeRecords.find((l)=>(l.id===recordId))
    if(!records){
        res.status(404).json({
            message:" OOPPS!!employee not found"
        })
    }else{
        res.status(200).json({
            status:"success",
            data:records
        })
    }
})
server.post("/records",(req,res)=>{
    const database=readData()
    const newRecord =req.body
    newRecord.id = database.employeeRecords.length +1
    database.employeeRecords.push(newRecord)
    writeDB(database)
    res.status(201).json({
        newData:newRecord
    })
 


})
server.put("/records/:id",(req,res)=>{
    const database=readData()
const recordId = parseInt(req.params.id)
const updatedRecords = req.body 
const index=database.employeeRecords.findIndex((i)=>(i.id===recordId))
if(index!==-1){
    database.employeeRecords[index]={...database.employeeRecords[index],...updatedRecords}
    writeDB(database)
    res.status(200).json({
        data:database.employeeRecords[index]
    })
}else{
    res.send("wrong id sent.")
}
})

server.delete("/records/:id",(req,res)=>{
    const database = readData()
    const recordId= parseInt(req.params.id)
    const index =database.employeeRecords.find((i)=>(i.id=== recordId))
    if(!database.employeeRecords[0]){
        res.status(404).json({
            message:`this id:${employeerId}does not exist`
        })
    }else{
        deletedEmployee= database.employeeRecords[index]
        database.employeeRecords.splice(index,1)
        writeDB(database)
        res.status(200).json({
            deletedEmployee:deletedEmployee
        })
    }
})
server.listen(port,()=>{
    console.log(`working on port ${port}`)
})