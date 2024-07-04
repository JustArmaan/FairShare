function generateColors(s: number, l: number, count: number) {
  const result: string[] = []
  const degrees = 360 / count
  let hue = 0
  for (let i = 0; i < count; i++) {
    const hex = hslToHex(hue, s, l)
    result.push(`"category-color-${i}":"${hex}",`)
    hue += degrees
  }
  return result
}

function hslToHex(h, s, l) {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function shuffle(array) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
  }
}

// const result = generateColors(100, 65, 17)
//
console.log([
  {
    name: "INCOME",
    displayName: "Income",
    icon: "/icons/dollar-sign.svg",
    color: "bg-category-color-0",
  },
  {
    name: "TRANSFER_IN",
    displayName: "Transfer In",
    icon: "/icons/dollar-sign.svg",
    color: "bg-category-color-1",
  },
  {
    name: "TRANSFER_OUT",
    displayName: "Transfer Out",
    icon: "/icons/dollar-sign.svg",
    color: "bg-category-color-2",
  },
  {
    name: "LOAN_PAYMENTS",
    displayName: "Loan Payments",
    icon: "/icons/dollar-sign.svg",
    color: "bg-category-color-3",
  },
  {
    name: "BANK_FEES",
    displayName: "Bank Fees",
    icon: "/icons/dollar-sign.svg",
    color: "bg-category-color-4",
  },
  {
    name: "ENTERTAINMENT",
    displayName: "Entertainment",
    icon: "/icons/entertainment.svg",
    color: "bg-category-color-5",
  },
  {
    name: "FOOD_AND_DRINK",
    displayName: "Food and Drink",
    icon: "/icons/local_dining.svg",
    color: "bg-accent-red",
  },
  {
    name: "GENERAL_MERCHANDISE",
    displayName: "General Merchandise",
    icon: "/icons/shopping-bag.svg",
    color: "bg-accent-purple",
  },
  {
    name: "HOME_IMPROVEMENT",
    displayName: "Home Improvement",
    icon: "/icons/rent.svg",
    color: "bg-category-color-8",
  },
  {
    name: "RENT_AND_UTILITIES",
    displayName: "Rent and Utilities",
    icon: "/icons/electricity.svg",
    color: "bg-accent-red",
  },
  {
    name: "TRAVEL",
    displayName: "Travel",
    icon: "/icons/local_gas_station.svg",
    color: "bg-category-color-10",
  },
  {
    name: "TRANSPORTATION",
    displayName: "Transportation",
    icon: "/icons/local_gas_station.svg",
    color: "bg-category-color-11",
  },
  {
    name: "GOVERNMENT_AND_NON_PROFIT",
    displayName: "Government and Non Profit",
    icon: "/icons/government.svg",
    color: "bg-accent-green",
  },
  {
    name: "GENERAL_SERVICES",
    displayName: "General Services",
    icon: "/icons/services.svg",
    color: "bg-accent-yellow",
  },
  {
    name: "PERSONAL_CARE",
    displayName: "Personal Care",
    icon: "/icons/internet.svg",
    color: "bg-category-color-14",
  },
  {
    name: "MEDICAL",
    displayName: "Medical",
    icon: "/icons/pharmacy.svg",
    color: "bg-category-color-15",
  },
  {
    name: "OTHER",
    displayName: "Other",
    icon: "/icons/plus.svg",
    color: "bg-category-color-16",
  },
].length)
