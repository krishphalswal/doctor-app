import { PrismaClient } from './generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'
import fs from 'fs'

const prismaClientSingleton = () => {
  let dbPath = path.resolve(process.cwd(), 'dev.db')

  if (process.env.VERCEL === '1') {
    const tmpDbPath = '/tmp/dev.db'
    if (!fs.existsSync(tmpDbPath)) {
      try {
        fs.copyFileSync(dbPath, tmpDbPath)
        console.log('Successfully copied dev.db to /tmp/dev.db')
      } catch (error) {
        console.error('Failed to copy dev.db to /tmp/dev.db:', error)
      }
    }
    dbPath = tmpDbPath
  }

  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
