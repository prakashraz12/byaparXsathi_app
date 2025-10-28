export const normalizeToTimestamp = (value: any): number => {
        if (value instanceof Date) return value.getTime();
        if (typeof value === "string") return new Date(value).getTime();
        if (typeof value === "number") {
          return value < 1e12 ? value * 1000 : value;
        }
        return Date.now();
      };