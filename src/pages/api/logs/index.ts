import { NextApiRequest, NextApiResponse } from 'next/types'

const pino = require('pino');
const fs = require('fs');


const handleLogsMiddle = async (req: NextApiRequest, res: NextApiResponse) => {
    try {

        const { componente, funcion, usuario, permiso, respuesta } = req.body

        const logFilePath = 'logs/archivo.log';

        if (!fs.existsSync('logs/')) {
            fs.mkdirSync('logs/')
        }

        const logger = pino(
            fs.createWriteStream(logFilePath, { flags: 'a' })
        )

        const padre = logger.child({ usuario, funcion, permiso, respuesta })
        padre.info(componente)

        return res.status(200).end('logs registrados')

    } catch (error: any) {
        return res.status(500).end(error.message)
    }
}

export default handleLogsMiddle
