import { addDays, getUnixTime, parse } from "date-fns";

export const EmailTokenConfigs = {
  // expires_in: dayjs().add(15, 'second').unix()
  expires_in: getUnixTime(addDays(new Date(), 1)),
};
