export const DEFAULT_DATE_RANGE_OPTIONS_ENUMS = {
  TODAY: 'TODAY',
  YESTERDAY: 'YESTERDAY',
  THIS_WEEK: 'THIS_WEEK',
  THIS_MONTH: 'THIS_MONTH',
  THIS_YEAR: 'THIS_YEAR',
  ALL_TIME: 'ALL_TIME',
  CUSTOM_RNAGE: 'CUSTOM_RANGE',
} as const;

export const DEFAULT_DATE_RANGE_OPTIONS = [
  {
    label: 'All Time',
    value: DEFAULT_DATE_RANGE_OPTIONS_ENUMS.ALL_TIME,
  },

  {
    label: 'Today',
    value: DEFAULT_DATE_RANGE_OPTIONS_ENUMS.TODAY,
  },
  {
    label: 'Yesterday',
    value: DEFAULT_DATE_RANGE_OPTIONS_ENUMS.YESTERDAY,
  },
  {
    label: 'This Week',
    value: DEFAULT_DATE_RANGE_OPTIONS_ENUMS.THIS_WEEK,
  },
  {
    label: 'This Month',
    value: DEFAULT_DATE_RANGE_OPTIONS_ENUMS.THIS_MONTH,
  },
  {
    label: 'This Year',
    value: DEFAULT_DATE_RANGE_OPTIONS_ENUMS.THIS_YEAR,
  },

  {
    label: 'Custom Range',
    value: DEFAULT_DATE_RANGE_OPTIONS_ENUMS.CUSTOM_RNAGE,
  },
];

export const dateRangeProvider = (
  range: (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS],
) => {
  const today = new Date();

  if (range === DEFAULT_DATE_RANGE_OPTIONS_ENUMS.TODAY) {
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0); // Set to 00:00:00.000

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999); // Set to 23:59:59.999

    return {
      startDate,
      endDate,
    };
  }

  if (range === DEFAULT_DATE_RANGE_OPTIONS_ENUMS.YESTERDAY) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startDate = new Date(yesterday);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(yesterday);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate,
      endDate,
    };
  }

  if (range === DEFAULT_DATE_RANGE_OPTIONS_ENUMS.THIS_MONTH) {
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate,
      endDate,
    };
  }
};
