/* eslint-disable @typescript-eslint/no-unused-vars */
export const getUserLocation = async (): Promise<{
  country: string;
  city: string;
  region: string;
  timezone: string;
  latitude: string;
  longitude: string;
}> => {
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();

    if (data) {
      return {
        country: data?.country,
        city: data?.city,
        region: data?.region,
        timezone: data?.timezone,
        latitude: data?.latitude,
        longitude: data?.longitude,
      };
    }
    return {
      country: '',
      city: '',
      region: '',
      timezone: '',
      latitude: '',
      longitude: '',
    };
  } catch (err) {
    return {
      country: '',
      city: '',
      region: '',
      timezone: '',
      latitude: '',
      longitude: '',
    };
  }
};
