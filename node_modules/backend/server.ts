import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors()) 


const storage = multer.memoryStorage()
const upload = multer({ storage:storage })

let userData:Array<Record<string,string>> = []


app.post('/api/files', upload.single('file'), async (req, res) =>{
    const{file}=req
    if(!file){
        return res.status(500).send({message:'No file uploaded'})
    }
    if(file.mimetype != 'text/csv'){
        return res.status(500).json({ message: 'File must be csv'})
    }
    let json:Array<Record<string,string>> = []
    try{
        const csv= Buffer.from(file.buffer).toString('utf-8')
        json = csvToJson.fieldDelimiter(',').csvStringToJson(csv)
        console.log(csv)
    }catch(error){
        return res.status(500).json({ message: 'Error parsing csv file', error })
    }

    userData=json

    return res.status(200).json({data:json, message:'File Updated successfully'})
})


app.get('/api/users', async(req,res)=>{
    const {q} = req.query
    if(!q){
        return res.status(500).json({ mesagge:"Query param 'q' is required "})

    }
    if(Array.isArray(q)){
        return res.status(500).json({ message: 'Query param q must be a string'})
    }
    const search = q.toString().toLowerCase()
    const filteredData = userData.filter(row => {
        return Object.values(row).some(value => value.toLowerCase().includes(search))
    })
    return res.status(200).json({data:filteredData})
})

app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`) 
})