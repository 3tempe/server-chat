import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'

export default function () {
    initializeApp({
        credential: cert('./serviceAccount.json'),
    })
}
