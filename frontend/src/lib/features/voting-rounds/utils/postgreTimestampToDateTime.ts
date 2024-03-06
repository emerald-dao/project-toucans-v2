import { parseAbsoluteToLocal } from '@internationalized/date';

export const postgreTimestampToDateTime = (timestamp: string) => parseAbsoluteToLocal(timestamp);
