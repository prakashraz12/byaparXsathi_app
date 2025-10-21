
// Nepali Calendar utility functions
export const calendarData = {
  bsMonths: [
    'बैशाख',
    'जेठ',
    'असार',
    'साउन',
    'भदौ',
    'असोज',
    'कार्तिक',
    'मंसिर',
    'पौष',
    'माघ',
    'फागुन',
    'चैत',
  ],
  bsMonthsENG: [
    'Baisakh',
    'Jeth',
    'Asar',
    'Shrawan',
    'Bhadra',
    'Asoj',
    'Kartik',
    'Mansir',
    'Poush',
    'Magh',
    'Fagun',
    'Chaitra',
  ],
  bsDays: ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'],
  adDays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  nepaliNumbers: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  bsMonthUpperDays: [
    [30, 31],
    [31, 32],
    [31, 32],
    [31, 32],
    [31, 32],
    [30, 31],
    [29, 30],
    [29, 30],
    [29, 30],
    [29, 30],
    [29, 30],
    [30, 31],
  ],
  extractedBsMonthData: [
    [
      0, 1, 1, 22, 1, 3, 1, 1, 1, 3, 1, 22, 1, 3, 1, 3, 1, 22, 1, 3, 1, 19, 1,
      3, 1, 1, 3, 1, 2, 2, 1, 3, 1,
    ],
    [
      1, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 3, 2, 2, 2, 1, 3, 1, 3, 1, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
      3, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 3, 1, 1, 2,
    ],
    [
      0, 1, 2, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2,
      1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 1, 3, 1, 3, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 3, 1, 1, 2,
    ],
    [
      1, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1,
      3, 1, 3, 1, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 1, 3, 1, 3,
      1, 3, 1, 3, 1, 3, 1, 3, 2, 2, 1, 3, 1, 2, 2, 2, 1, 2,
    ],
    [59, 1, 26, 1, 28, 1, 2, 1, 12],
    [
      0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 5, 1, 1, 2, 2, 1, 3, 1, 2, 1, 2,
    ],
    [
      0, 12, 1, 3, 1, 3, 1, 5, 1, 11, 1, 3, 1, 3, 1, 18, 1, 3, 1, 3, 1, 18, 1,
      3, 1, 3, 1, 27, 1, 2,
    ],
    [
      1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 1, 2, 2, 2, 15, 2, 4,
    ],
    [
      0, 1, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 3, 2, 2, 2, 1, 3, 1, 3, 1,
      3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      1, 3, 1, 3, 1, 2, 2, 2, 15, 2, 4,
    ],
    [
      1, 1, 3, 1, 3, 1, 14, 1, 3, 1, 1, 1, 3, 1, 14, 1, 3, 1, 3, 1, 3, 1, 18, 1,
      3, 1, 3, 1, 3, 1, 14, 1, 3, 15, 1, 2, 1, 1,
    ],
    [
      0, 1, 1, 3, 1, 3, 1, 10, 1, 3, 1, 3, 1, 1, 1, 3, 1, 3, 1, 10, 1, 3, 1, 3,
      1, 3, 1, 3, 1, 14, 1, 3, 1, 3, 1, 3, 1, 3, 1, 10, 1, 20, 1, 1, 1,
    ],
    [
      1, 2, 2, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1, 3, 1, 3,
      1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2, 2, 2, 2, 2, 2,
      2, 1, 3, 1, 3, 1, 20, 3,
    ],
  ],
  minBsYear: 1970,
  maxBsYear: 2100,
  minAdDateEqBsDate: {
    ad: {
      year: 1913,
      month: 4,
      date: 13,
    },
    bs: {
      year: 1970,
      month: 1,
      date: 1,
    },
  },
};

export interface BsDate {
  bsYear: number;
  bsMonth: number;
  bsDate: number;
}

export interface AdDate {
  year: number;
  month: number;
  date: number;
}

// Updated month data with correct values
export const bsMonthData: Record<number, number[]> = {
  2081: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 31],
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2085: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
};

// Utility functions for Nepali calendar
export const nepaliCalendar = {
  // Convert Nepali number to English
  getNepaliNumber: (number: number): string => {
    if (typeof number === 'undefined') {
      throw new Error('Parameter number is required');
    } else if (typeof number != 'number' || number < 0) {
      throw new Error('Number should be positive integer');
    }

    const prefixNum = Math.floor(number / 10);
    const suffixNum = number % 10;
    if (prefixNum !== 0) {
      return (
        nepaliCalendar.getNepaliNumber(prefixNum) +
        calendarData.nepaliNumbers[suffixNum]
      );
    } else {
      return calendarData.nepaliNumbers[suffixNum];
    }
  },

  // Get BS month days
  getBsMonthDays: (bsYear: number, bsMonth: number): number => {
    if (bsYear < calendarData.minBsYear || bsYear > calendarData.maxBsYear) {
      throw new Error(
        `Year should be between ${calendarData.minBsYear} and ${calendarData.maxBsYear}`
      );
    }
    if (bsMonth < 1 || bsMonth > 12) {
      throw new Error('Month should be between 1 and 12');
    }

    let yearCount = 0;
    const totalYears = bsYear + 1 - calendarData.minBsYear;
    const bsMonthData = calendarData.extractedBsMonthData[bsMonth - 1];

    for (let i = 0; i < bsMonthData.length; i++) {
      if (bsMonthData[i] === 0) {
        continue;
      }

      const bsMonthUpperDaysIndex = i % 2;
      yearCount += bsMonthData[i];
      if (totalYears <= yearCount) {
        if (
          (bsYear === 2085 && bsMonth === 5) ||
          (bsYear === 2088 && bsMonth === 5)
        ) {
          return (
            calendarData.bsMonthUpperDays[bsMonth - 1][bsMonthUpperDaysIndex] -
            2
          );
        } else if (bsYear === 2081 && bsMonth === 2) {
          return calendarData.bsMonthUpperDays[bsMonth - 1][
            bsMonthUpperDaysIndex + 1
          ];
        } else if (bsYear === 2081 && bsMonth === 3) {
          return calendarData.bsMonthUpperDays[bsMonth - 1][
            bsMonthUpperDaysIndex - 1
          ];
        } else if (bsYear === 2081 && bsMonth === 11) {
          return (
            calendarData.bsMonthUpperDays[bsMonth - 1][bsMonthUpperDaysIndex] -
            1
          );
        } else if (bsYear === 2081 && bsMonth === 12) {
          return (
            calendarData.bsMonthUpperDays[bsMonth - 1][bsMonthUpperDaysIndex] +
            1
          );
        } else {
          return calendarData.bsMonthUpperDays[bsMonth - 1][
            bsMonthUpperDaysIndex
          ];
        }
      }
    }

    return 30; // Default fallback
  },

  // FIXED: Get AD date from BS date
  getAdDateByBsDate: (
    bsYear: number,
    bsMonth: number,
    bsDate: number
  ): Date => {
    if (bsYear < calendarData.minBsYear || bsYear > calendarData.maxBsYear) {
      throw new Error(
        `Year should be between ${calendarData.minBsYear} and ${calendarData.maxBsYear}`
      );
    }

    const daysNumFromMinBsYear = nepaliCalendar.getTotalDaysNumFromMinBsYear(
      bsYear,
      bsMonth,
      bsDate
    );


    // Create AD date properly - JavaScript Date constructor expects (year, month-1, date)
    const adDate = new Date(
      calendarData.minAdDateEqBsDate.ad.year,
      calendarData.minAdDateEqBsDate.ad.month -1,
      calendarData.minAdDateEqBsDate.ad.date
    );

   

    adDate.setDate(adDate.getDate() + daysNumFromMinBsYear);
    return adDate;
  },

  //   यो function getAdDateByBsDate को जिम्मेवारी हो — दिइएको Bikram Sambat (BS) मितिलाई Gregorian Calendar (AD) मितिमा रूपान्तरण गर्नु।

  // विस्तृत व्याख्या नेपालीमा:
  // यो function ले तीन वटा इनपुट लिन्छ:

  // bsYear — विक्रम संवत वर्ष (जस्तै: 2081)

  // bsMonth — महिना (1 देखि 12 सम्म)

  // bsDate — मिति (1 देखि महिनाको अन्तिम मिति सम्म)

  // कार्य प्रक्रिया:
  // Validation:
  // सुरुमा function ले जाँच गर्छ कि दिइएको वर्ष calendarData.minBsYear र calendarData.maxBsYear को बीचमा छ कि छैन। यदि छैन भने Error फ्याल्छ।

  // कुल दिन गनिन्छ:
  // nepaliCalendar.getTotalDaysNumFromMinBsYear(...) भन्ने function प्रयोग गरेर calendarData.minBsYear बाट सुरु गरेर दिइएको BS मितिसम्म कति दिन भइसकेको छ भनेर गणना गर्छ।

  // AD मिति बनाइन्छ:
  // calendarData.minAdDateEqBsDate.ad भन्ने आधार मितिबाट सुरु गरेर (जसले बताउँछ कुन AD मिति कुन BS मितिसँग मेल खान्छ) गणना गरिएको दिन संख्या थपेर वास्तविक AD मिति निकालिन्छ।

  // Return:
  // अन्त्यमा, Date object को रूपमा त्यो AD मिति फिर्ता गर्छ।

  // उदाहरण:
  // मानौं calendarData.minBsYear = 2000 र त्यस वर्षको वैशाख 1 को बराबरी April 14, 1943 AD हो भने,
  // यदि तपाईंले getAdDateByBsDate(2081, 1, 1) पठाउनुभयो भने,
  // यो function ले 2081 साल वैशाख 1 सम्म कति दिन भइसकेको छ भनेर गनी April 14, 1943 मा त्यो दिन संख्या थपेर 2081 वैशाख 1 को अंग्रेजी मिति फिर्ता गर्छ।

  // FIXED: Get BS date from AD date
  getBsDateByAdDate: (
    adYear: number,
    adMonth: number,
    adDate: number
  ): BsDate => {
    let bsYear = adYear + 57;
    let bsMonth = (adMonth + 9) % 12;
    bsMonth = bsMonth === 0 ? 12 : bsMonth;
    let bsDate = 1;

    if (adMonth < 4) {
      bsYear -= 1;
    } else if (adMonth === 4) {
      const bsYearFirstAdDate = nepaliCalendar.getAdDateByBsDate(bsYear, 1, 1);
      if (adDate < bsYearFirstAdDate.getDate()) {
        bsYear -= 1;
      }
    }

    const bsMonthFirstAdDate = nepaliCalendar.getAdDateByBsDate(
      bsYear,
      bsMonth,
      1
    );
    if (adDate >= 1 && adDate < bsMonthFirstAdDate.getDate()) {
      bsMonth = bsMonth !== 1 ? bsMonth - 1 : 12;
      if (bsMonth === 12) bsYear -= 1;
      const bsMonthDays = nepaliCalendar.getBsMonthDays(bsYear, bsMonth);
      bsDate = bsMonthDays - (bsMonthFirstAdDate.getDate() - adDate) + 1;
    } else {
      bsDate = adDate - bsMonthFirstAdDate.getDate() + 1;
    }

    return {
      bsYear,
      bsMonth,
      bsDate,
    };
  },

  // Get total days from min BS year
  getTotalDaysNumFromMinBsYear: (
    bsYear: number,
    bsMonth: number,
    bsDate: number
  ): number => {
    if (bsYear < calendarData.minBsYear || bsYear > calendarData.maxBsYear) {
      throw new Error(
        `Year should be between ${calendarData.minBsYear} and ${calendarData.maxBsYear}`
      );
    }

    let daysNumFromMinBsYear = 0;
    const diffYears = bsYear - calendarData.minBsYear;

    for (let month = 1; month <= 12; month++) {
      if (month < bsMonth) {
        daysNumFromMinBsYear += nepaliCalendar.getMonthDaysNumFormMinBsYear(
          month,
          diffYears + 1
        );
      } else {
        daysNumFromMinBsYear += nepaliCalendar.getMonthDaysNumFormMinBsYear(
          month,
          diffYears
        );
      }
    }

    if (bsYear > 2085 && bsYear < 2088) {
      daysNumFromMinBsYear += bsDate - 2;
    } else if (bsYear === 2085 && bsMonth > 5) {
      daysNumFromMinBsYear += bsDate - 2;
    } else if (bsYear === 2081 && bsMonth === 3) {
      daysNumFromMinBsYear += bsDate + 1;
    } else if (bsYear === 2081 && bsMonth === 12) {
      daysNumFromMinBsYear += bsDate - 1;
    } else if (bsYear > 2088) {
      daysNumFromMinBsYear += bsDate - 4;
    } else if (bsYear === 2088 && bsMonth > 5) {
      daysNumFromMinBsYear += bsDate - 4;
    } else {
      daysNumFromMinBsYear += bsDate;
    }

    return daysNumFromMinBsYear;
  },

  // Get month days from min BS year
  getMonthDaysNumFormMinBsYear: (bsMonth: number, yearDiff: number): number => {
    if (bsMonth < 1 || bsMonth > 12) {
      throw new Error('Month should be between 1 and 12');
    }
    if (yearDiff < 0) {
      throw new Error('Year difference should be positive');
    }

    let yearCount = 0;
    let monthDaysFromMinBsYear = 0;
    if (yearDiff === 0) {
      return 0;
    }

    const bsMonthData = calendarData.extractedBsMonthData[bsMonth - 1];
    for (let i = 0; i < bsMonthData.length; i++) {
      if (bsMonthData[i] === 0) {
        continue;
      }

      const bsMonthUpperDaysIndex = i % 2;
      if (yearDiff > yearCount + bsMonthData[i]) {
        yearCount += bsMonthData[i];
        monthDaysFromMinBsYear +=
          calendarData.bsMonthUpperDays[bsMonth - 1][bsMonthUpperDaysIndex] *
          bsMonthData[i];
      } else {
        monthDaysFromMinBsYear +=
          calendarData.bsMonthUpperDays[bsMonth - 1][bsMonthUpperDaysIndex] *
          (yearDiff - yearCount);
        yearCount = yearDiff - yearCount;
        break;
      }
    }

    return monthDaysFromMinBsYear;
  },

  // Format BS date
  formatBsDateNP: (bsDate: BsDate, format = 'YYYY-MM-DD'): string => {
    const { bsYear, bsMonth, bsDate: date } = bsDate;

    return format
      .replace('YYYY', nepaliCalendar.getNepaliNumber(bsYear))
      .replace('MM', nepaliCalendar.getNepaliNumber(bsMonth).padStart(2, '०'))
      .replace('DD', nepaliCalendar.getNepaliNumber(date).padStart(2, '०'))
      .replace('MMM', calendarData.bsMonths[bsMonth - 1]);
  },

  formatBsDateEN: (bsDate: BsDate, format = 'YYYY-MM-DD'): string => {
    const { bsYear, bsMonth, bsDate: date } = bsDate;

    return format
      .replace('YYYY', bsYear.toString())
      .replace('MM', bsMonth.toString())
      .replace('DD', date.toString())
      .replace('MMM', calendarData.bsMonthsENG[bsMonth - 1]);
  },

  // Get current BS date
  getCurrentBsDate: (): BsDate => {
    try {
      const today = new Date();
      return {
        bsYear: nepaliCalendar.getBsDateByAdDate(today.getFullYear(), today.getMonth() + 1, today.getDate()).bsYear,
        bsMonth: nepaliCalendar.getBsDateByAdDate(today.getFullYear(), today.getMonth() + 1, today.getDate()).bsMonth,
        bsDate: nepaliCalendar.getBsDateByAdDate(today.getFullYear(), today.getMonth() + 1, today.getDate()).bsDate,
      };
    } catch (error) {
      console.log(error);
      return { bsYear: 2080, bsMonth: 1, bsDate: 1 };
    }
  },

  // Check if two BS dates are equal
  isSameDay: (date1: BsDate, date2: BsDate): boolean => {
    return (
      date1.bsYear === date2.bsYear &&
      date1.bsMonth === date2.bsMonth &&
      date1.bsDate === date2.bsDate
    );
  },

  // Check if a date is before another date
  isBefore: (date1: BsDate, date2: BsDate): boolean => {
    if (date1.bsYear < date2.bsYear) return true;
    if (date1.bsYear > date2.bsYear) return false;
    if (date1.bsMonth < date2.bsMonth) return true;
    if (date1.bsMonth > date2.bsMonth) return false;
    return date1.bsDate < date2.bsDate;
  },

  // Check if a date is after another date
  isAfter: (date1: BsDate, date2: BsDate): boolean => {
    if (date1.bsYear > date2.bsYear) return true;
    if (date1.bsYear < date2.bsYear) return false;
    if (date1.bsMonth > date2.bsMonth) return true;
    if (date1.bsMonth < date2.bsMonth) return false;
    return date1.bsDate > date2.bsDate;
  },

  // Add days to a BS date
  addDays: (date: BsDate, days: number): BsDate => {
    const adDate = nepaliCalendar.getAdDateByBsDate(
      date.bsYear,
      date.bsMonth,
      date.bsDate
    );
    adDate.setDate(adDate.getDate() + days);
    return nepaliCalendar.getBsDateByAdDate(
      adDate.getFullYear(),
      adDate.getMonth() + 1,
      adDate.getDate()
    );
  },

  // Get days in month
  getDaysInBsMonth: (year: number, month: number): number => {
    const yearData = bsMonthData[year];
    if (!yearData)
      throw new Error(`Year ${year} not found in BS calendar config`);

    const days = yearData[month - 1]; // month is 1-indexed (1 = Baisakh)
    if (!days) throw new Error(`Invalid month ${month} for year ${year}`);
    return days;
  },

  // FIXED: Get day of week (0-6, Sunday to Saturday)
  getDayOfWeek: (date: BsDate): number => {
    try {
     
      const adDate = nepaliCalendar.getAdDateByBsDate(
        date.bsYear,
        date.bsMonth,
        date.bsDate
      );
      return adDate.getDay();
    } catch (error) {
      const adDate = nepaliCalendar.getAdDateByBsDate(
        date.bsYear,
        date.bsMonth,
        date.bsDate
      );
      return adDate.getDay();
    }
  },

  // NEW: Validate date continuity between months
  validateDateContinuity: (year: number, month: number): boolean => {
    try {
      // Get last day of current month
      const daysInMonth = nepaliCalendar.getBsMonthDays(year, month);
      const lastDayOfMonth = {
        bsYear: year,
        bsMonth: month,
        bsDate: daysInMonth,
      };

      // Get first day of next month
      let nextMonth = month + 1;
      let nextYear = year;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear = year + 1;
      }

      const firstDayOfNextMonth = {
        bsYear: nextYear,
        bsMonth: nextMonth,
        bsDate: 1,
      };

      // Get day of week for both dates
      const lastDayWeek = nepaliCalendar.getDayOfWeek(lastDayOfMonth);
      const firstDayWeek = nepaliCalendar.getDayOfWeek(firstDayOfNextMonth);

      // They should be consecutive days
      const expectedNextDay = (lastDayWeek + 1) % 7;

      return expectedNextDay === firstDayWeek;
    } catch (error) {
      console.error('Error validating date continuity:', error);
      return false;
    }
  },

  // NEW: Debug function to check specific date transitions
  debugDateTransition: (year: number, fromMonth: number, toMonth: number) => {
    try {
      const fromDays = nepaliCalendar.getBsMonthDays(year, fromMonth);
      console.log(
        `${calendarData.bsMonthsENG[fromMonth - 1]} has ${fromDays} days`
      );

      // Check last few days of fromMonth
      for (let day = Math.max(1, fromDays - 2); day <= fromDays; day++) {
        const date = { bsYear: year, bsMonth: fromMonth, bsDate: day };
        const dayOfWeek = nepaliCalendar.getDayOfWeek(date);
        console.log(
          `${calendarData.bsMonthsENG[fromMonth - 1]} ${day}: ${calendarData.adDays[dayOfWeek]}`
        );
      }

      // Check first few days of toMonth
      const nextYear = toMonth === 1 ? year + 1 : year;
      for (let day = 1; day <= 3; day++) {
        const date = { bsYear: nextYear, bsMonth: toMonth, bsDate: day };
        const dayOfWeek = nepaliCalendar.getDayOfWeek(date);
        console.log(
          `${calendarData.bsMonthsENG[toMonth - 1]} ${day}: ${calendarData.adDays[dayOfWeek]}`
        );
      }

      // Validate continuity
      const isValid = nepaliCalendar.validateDateContinuity(year, fromMonth);
      console.log(`Continuity valid: ${isValid}`);
    } catch (error) {
      console.error('Error in debug function:', error);
    }

    console.log('=== End Debug ===\n');
  },

  // NEW: Get next date
  getNextDate: (date: BsDate): BsDate => {
    const daysInMonth = nepaliCalendar.getBsMonthDays(
      date.bsYear,
      date.bsMonth
    );

    if (date.bsDate < daysInMonth) {
      // Next day in same month
      return {
        bsYear: date.bsYear,
        bsMonth: date.bsMonth,
        bsDate: date.bsDate + 1,
      };
    } else {
      // First day of next month
      if (date.bsMonth < 12) {
        return {
          bsYear: date.bsYear,
          bsMonth: date.bsMonth + 1,
          bsDate: 1,
        };
      } else {
        return {
          bsYear: date.bsYear + 1,
          bsMonth: 1,
          bsDate: 1,
        };
      }
    }
  },

  // NEW: Get previous date
  getPreviousDate: (date: BsDate): BsDate => {
    if (date.bsDate > 1) {
      // Previous day in same month
      return {
        bsYear: date.bsYear,
        bsMonth: date.bsMonth,
        bsDate: date.bsDate - 1,
      };
    } else {
      // Last day of previous month
      if (date.bsMonth > 1) {
        const prevMonth = date.bsMonth - 1;
        const daysInPrevMonth = nepaliCalendar.getBsMonthDays(
          date.bsYear,
          prevMonth
        );
        return {
          bsYear: date.bsYear,
          bsMonth: prevMonth,
          bsDate: daysInPrevMonth,
        };
      } else {
        const daysInPrevMonth = nepaliCalendar.getBsMonthDays(
          date.bsYear - 1,
          12
        );
        return {
          bsYear: date.bsYear - 1,
          bsMonth: 12,
          bsDate: daysInPrevMonth,
        };
      }
    }
  },
};