export const SYMBOLS = ["10", "20", "50", "100", "200", "500", "1K", "5K", "10K", "50K", "100K", "500K", "1M"] as const
export type Symbol = typeof SYMBOLS[number]

export const SYMBOL_MEANINGS: Record<Symbol, string> = {
  "10": "10 sats",
  "20": "20 sats",
  "50": "50 sats",
  "100": "100 sats",
  "200": "200 sats",
  "500": "500 sats",
  "1K": "1,000 sats",
  "5K": "5,000 sats",
  "10K": "10,000 sats",
  "50K": "50,000 sats",
  "100K": "100,000 sats",
  "500K": "500,000 sats",
  "1M": "1,000,000 sats"
}

export const SYMBOL_PROBABILITIES: Record<Symbol, number> = {
  "10": 0.30,
  "20": 0.25,
  "50": 0.20,
  "100": 0.10,
  "200": 0.05,
  "500": 0.04,
  "1K": 0.03,
  "5K": 0.01,
  "10K": 0.007,
  "50K": 0.002,
  "100K": 0.0007,
  "500K": 0.0002,
  "1M": 0.0001
}

export const WINNING_COMBINATIONS: Record<string, string> = {
  "101010": "Triple 10: Win 30 sats!",
  "202020": "Triple 20: Win 60 sats!",
  "505050": "Triple 50: Win 150 sats!",
  "100100100": "Triple 100: Win 300 sats!",
  "200200200": "Triple 200: Win 600 sats!",
  "500500500": "Triple 500: Win 1,500 sats!",
  "1K1K1K": "Triple 1K: Win 3,000 sats!",
  "5K5K5K": "Triple 5K: Win 15,000 sats!",
  "10K10K10K": "Triple 10K: Win 30,000 sats!",
  "50K50K50K": "Triple 50K: Win 150,000 sats!",
  "100K100K100K": "Triple 100K: Win 300,000 sats!",
  "500K500K500K": "Triple 500K: Win 1,500,000 sats!",
  "1M1M1M": "JACKPOT: Win 3,000,000 sats!"
}