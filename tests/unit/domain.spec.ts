import { describe, expect, test } from 'vitest'
import { durationText, slotStartMinutes, tidyDaysOff } from '@/domain/availability'
import { formatRef, newId } from '@/domain/ids'

describe('identifiers', () => {
  test('newId returns a dashless UUID in the shape Data Connect returns', () => {
    const id = newId()
    expect(id).toMatch(/^[0-9a-f]{32}$/)
    expect(newId()).not.toBe(id)
  })

  test('formatRef pads the sequence to four digits', () => {
    expect(formatRef(1)).toBe('FF-0001')
    expect(formatRef(42)).toBe('FF-0042')
  })
})

describe('availability', () => {
  test('slots never cross the lunch break', () => {
    const day = { open: true, from: 9 * 60, to: 12 * 60 }
    const lunch = { enabled: true, from: 11 * 60, to: 12 * 60 }
    expect(slotStartMinutes(day, 60, lunch)).toEqual([9 * 60, 10 * 60])
  })

  test('a closed day has no slots', () => {
    const day = { open: false, from: 9 * 60, to: 17 * 60 }
    expect(slotStartMinutes(day, 60, { enabled: false, from: 12 * 60, to: 13 * 60 })).toEqual([])
  })

  test('tidyDaysOff drops past dates and sorts the rest', () => {
    const now = new Date(2026, 9, 28, 12).getTime()
    const daysOff = [
      { date: '2026-11-02', label: 'Later' },
      { date: '2026-10-01', label: 'Past' },
      { date: '2026-11-01', label: 'Sooner' },
    ]
    expect(tidyDaysOff(daysOff, now).map((entry) => entry.date)).toEqual(['2026-11-01', '2026-11-02'])
  })

  test('durationText reads naturally', () => {
    expect(durationText(30)).toBe('30 minutes')
    expect(durationText(60)).toBe('1 hour')
    expect(durationText(90)).toBe('1 hour 30 minutes')
    expect(durationText(1440)).toBe('1 day')
  })
})
