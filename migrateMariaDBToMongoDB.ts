import { Text, Learn } from './src/lib/databases'
import { connect, disconnect } from 'mongoose'
import { createConnection, type RowDataPacket } from 'mysql2/promise'

// 필요한 타입 지정
interface IText extends RowDataPacket {
  text: string
  persona: string
  created_at: Date
}

interface ILearn extends RowDataPacket {
  command: string
  result: string
  user_id: string
  created_at: Date
}

// 필요한 환경 변수 (.env) 확인
if (!process.env.DATABASE_URL)
  throw new Error('.env 파일에서 필요한 DATABASE_URL값이 없어요.')

if (!process.env.PREVIOUS_DATABASE_URL)
  throw new Error('.env 파일에서 필요한 PREVIOUS_DATABASE_URL값이 없어요.')

// MongoDB와 연결
await connect(process.env.DATABASE_URL!)

// MariaDB와 연결
const client = await createConnection(process.env.PREVIOUS_DATABASE_URL!)
await client.connect()

// 기존 머핀봇 데이터에서 데이터 추출
const [statementData] = await client.execute<IText[]>(
  'select text, persona, created_at from statement;',
)
const [nsfwContentData] = await client.execute<IText[]>(
  'select text, persona, created_at from nsfw_content;',
)
const [learnData] = await client.execute<ILearn[]>(
  'select command, result, user_id, created_at from learn;',
)

let i1 = 1
let i2 = 1
let i3 = 1

// 새로운 데이터베이스로 이전
for (const data of statementData) {
  console.log(`statement ${i1++}`)
  if (!data.text) data.text = '살ㄹ려주세요'
  await new Text(data).save()
}

for (const data of nsfwContentData) {
  console.log(`nsfw_content ${i2++}`)
  if (!data.text) data.text = '살ㄹ려주세요'
  await new Text(data).save()
}

for (const data of learnData) {
  console.log(`learn ${i3++}`)
  await new Learn(data).save()
}

// 연결 종료
await disconnect()
client.destroy()
