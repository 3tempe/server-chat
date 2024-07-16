import 'dotenv/config'
import runFirebase from './instance.js'
runFirebase()

import express from 'express'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { Server } from 'socket.io'
import { getFirestore } from 'firebase-admin/firestore'
// import serviceAccount from './serviceAccount.js'

// console.log(serviceAccount)

const db = getFirestore()
const docRef = db.collection('chat').doc('room1')

const app = express()
const server = createServer(app)
const io = new Server(server)

const __dirname = dirname(fileURLToPath(import.meta.url))

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
})

io.on('connection', async (socket) => {
    // Mengambil pesan yang ada di Firestore dan mengirimkannya ke klien
    const snapshot = await docRef
        .collection('messages')
        .orderBy('createdAt')
        .get()
    snapshot.forEach((doc) => {
        socket.emit('catsa message', doc.data().message)
    })

    // Mendengarkan pesan dari klien dan menyimpannya ke Firestore
    socket.on('catsa message', async (msg) => {
        io.emit('catsa message', msg)
        await docRef.collection('messages').add({
            createdAt: new Date(),
            message: msg,
            sender: 'Oda',
        })
    })
})

server.listen(3000, () => {
    console.log('server running at http://localhost:3000')
})
