import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import snakeCase from 'snakecase-keys'
interface FixBody {
  Data: any
  Params: any
  AvaibleNext: boolean
  ServerProcessTime: any
}
export default class ResponseTime {
  FixBody: FixBody
  public async handle (
    { response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    //startProcessTime
    let startAt = process.hrtime()
    await next()
    //getLastProcessTime
    const end = process.hrtime(startAt)
    let ServerProcessTime = ((end[0] * 1e9 + end[1]) / 1e6).toFixed(6)
    let Data = response.lazyBody[0]
    let Params = null
    let AvaibleNext = false
    this.FixBody = {
      AvaibleNext,
      Params,
      Data,
      ServerProcessTime
    }
    response.send(snakeCase(this.FixBody))
  }
}
