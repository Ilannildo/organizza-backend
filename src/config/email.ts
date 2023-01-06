import { addDays, getUnixTime } from "date-fns";

export const EmailConfigs = {
  // expires_in: dayjs().add(15, 'second').unix()
  expires_in: getUnixTime(addDays(new Date(), 1)),
};
