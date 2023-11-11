const crypto = require('crypto')


export function decryptText(encryptedTextHex : any)
{
    const algorithm = 'aes-256-cbc'
    const keyString = process.env.APP_SECRET_KEY_ENCRYPT
    const ivString = process.env.APP_SECRET_KEY_IV_ENCRYPT

    try {
        const hashKey = crypto.createHash('sha256')
        hashKey.update(keyString)
        const key = hashKey.digest()

        const hash = crypto.createHash('sha256')
        hash.update(ivString)
        const iv = hash.digest().slice(0, 16)

        const encryptedText = Buffer.from(encryptedTextHex, 'hex')
        const decipher = crypto.createDecipheriv(algorithm, key, iv)
        let decrypted = decipher.update(encryptedText)
        decrypted = Buffer.concat([decrypted, decipher.final()])

        return decrypted.toString()
    } catch (error) {
        console.error(`Error decrypting text: ${error}`)

        return null
    }
}

export function encryptText(encryptedTextHex: string) {
    const algorithm = 'aes-256-cbc'
    const keyString = process.env.APP_SECRET_KEY_ENCRYPT
    const ivString = process.env.APP_SECRET_KEY_IV_ENCRYPT

    try {
        const hashKey = crypto.createHash('sha256')
        hashKey.update(keyString)
        const key = hashKey.digest()

        const hash = crypto.createHash('sha256')
        hash.update(ivString)
        const iv = hash.digest().slice(0, 16)

        const cipher = crypto.createCipheriv(algorithm, key, iv)
        let encrypted = cipher.update(encryptedTextHex)
        encrypted = Buffer.concat([encrypted, cipher.final()])

        return encrypted.toString('hex')
    } catch (error) {
        console.error(`Error encrypting text: ${error}`)
        
        return null
    }
}