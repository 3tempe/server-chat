import { initializeApp, cert } from 'firebase-admin/app'
import serviceAccount from './serviceAccount.js'

export default function () {
    initializeApp({
        credential: cert(serviceAccount),
    })
}
