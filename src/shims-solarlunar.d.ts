declare module 'solarlunar' {
  interface LunarResult {
    lYear: number
    lMonth: number
    lDay: number
    isLeap: boolean
    zodiac: string
    cYear: string
    cMonth: string
    cDay: string
    gzYear: string
    gzMonth: string
    gzDay: string
    Animal: string
    lMonthChinese: string
    lDayChinese: string
    week: number
    constellation: string
  }

  export function solar2lunar(year: number, month: number, day: number): LunarResult
  export function lunar2solar(year: number, month: number, day: number, isLeapMonth: boolean): {
    cYear: number
    cMonth: number
    cDay: number
    year: number
    month: number
    day: number
    isLeap: boolean
  }
}
