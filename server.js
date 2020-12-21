const express = require("express");
const app = express();
const port = 5000;

const content = require("./content.txt");

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile('content.txt',{root:__dirname})
})
 

     app.post("/api/content", (req, res) => {
        const newContent = req.body;
        content.push(newContent);
        fs.writeFileSync("./content.txt", JSON.stringify(content, null, 2));
        res.json(content);
      });

      const getDurationInMilliseconds = (start) => {
        const NS_PER_SEC = 1e9
        const NS_TO_MS = 1e6
        const diff = process.hrtime(start)
    
        return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
    }
    
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.originalUrl} [STARTED]`)
        const start = process.hrtime()
    
        res.on('finish', () => {            
            const durationInMilliseconds = getDurationInMilliseconds (start)
            console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
        })
    
        res.on('close', () => {
            const durationInMilliseconds = getDurationInMilliseconds (start)
            console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
        })
    
        next()
    })
    
    const logger = (req,res,next) => {
        const start = process.hrtime()
    
        res.on('finish', () => { 
            const durationInMilliseconds = getDurationInMilliseconds(start)
    
            let logData = {url: req.originalUrl, method:req.method, duration:durationInMilliseconds }
            logData = JSON.stringify(logData)
    
            fs.writeFile("./log.txt", `${logData}\n` , { flag: "a" }, (err) => {
                if (err) {
                    res.send(err)
                }
            });
        })
        next();
    }
    
    app.use(logger)
    
    app.use(express.urlencoded({ extended: true }))
    
      
      app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`);
      });
