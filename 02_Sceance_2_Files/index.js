// ------------------------Simple Fs------------------------
const fs = require('fs');
const path = require('path')
/*

// -------Read Files-------

// ---1st Method---
fs.readFile('./files/startesr.txt','utf-8',(err,data) => {
    if(err) throw err;
    console.log(data)
    })
   
   // ---2nd Method Using Path Module---

fs.readFile(path.join(__dirname, 'files', 'starter.txt'),'utf-8',(err,data) => {
    if(err) throw err;
    console.log(data)
})


// -------Write in Files-------

fs.writeFile(path.join(__dirname, 'files', 'reply.txt'),'Hello World',(err) => {
    if(err) throw err;
    console.log("Write Complete")

    fs.appendFile(path.join(__dirname, 'files', 'reply.txt'),'\n \n Hello reply',(err) => {
    if(err) throw err;
    console.log("Append Complete")

    // Callback Hell
})

})

fs.appendFile(path.join(__dirname, 'files', 'test.txt'),'Hello test',(err) => {
    if(err) throw err;
    console.log("Append Complete")
})
*/


// ------------------------Fs Promises------------------------
const fsPromises = require('fs').promises

const fileOps = async () => {
    try {
        // Read File
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf-8')
        console.log(data)
        // Delete File
        await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt'))
        // Write in File
        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data)
        // Append in File
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\n Nice to meet you')
        // Rename File
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'))
        const newdata = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf-8')
        console.log(newdata)
    } catch (err) {
        console.error(err)
    }
}

fileOps()

// exit on uncaught errors

process.on('uncaughtException', err => {
    console.error(`There was an uncaught error : ${err}`)
    process.exit(1)
})