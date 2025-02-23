export class Config {
  private _getRequiredValue(key: string) {
    const value = process.env[key]

    if (!value) throw new Error(`.env 파일에서 필요한 ${key}값이 없어요.`)
    return value
  }

  private _getValue(key: string) {
    return process.env[key]
  }

  public bot = {
    token: this._getRequiredValue('BOT_TOKEN'),
    ownerId: this._getRequiredValue('BOT_OWNER_ID'),
    prefix: this._getRequiredValue('BOT_PREFIX'),
  }

  public train = {
    userId: this._getValue('TRAIN_USER_ID'),
  }
}
