import { Temporal } from "@js-temporal/polyfill";

export function maskDate(date: string) {
  return Temporal.PlainDate.from(date).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function maskTimeRange(start: string, end: string) {
  const s = Temporal.Instant.from(start).toLocaleString(
    undefined,
    { hourCycle: "h23", hour: "numeric", minute: "2-digit" },
  );
  const e = Temporal.Instant.from(end).toLocaleString(
    undefined,
    { hourCycle: "h23", hour: "numeric", minute: "2-digit" },
  );

  return `${s} - ${e}`;
}

export function maskTime(value: Temporal.PlainTime) {
  const time = value.toLocaleString(undefined, {
    hour: "numeric",
    minute: "numeric",
  });
  return `${time}`;
}

export function maskHourlyRate(rate: number | null) {
  if (!rate) return "Free";
  const masked = rate.toLocaleString("en-US", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${masked} / Hour`;
}

export function maskDurationSince(target: string) {
  const duration = Temporal.Now.instant().since(target).round({
    largestUnit: "month",
    relativeTo: Temporal.Now.zonedDateTimeISO(),
  });

  if (duration.months > 0) {
    return `${duration.months}mo ago`;
  }

  if (duration.weeks > 0) {
    return `${duration.weeks}w ago`;
  }

  if (duration.days > 0) {
    switch (duration.days) {
      case 1:
        return "yesterday";
      default:
        return `${duration.days}d ago`;
    }
  }

  if (duration.hours > 0) {
    return `${duration.hours}h ago`;
  }

  if (duration.minutes > 0) {
    return `${duration.minutes}m ago`;
  }

  return "just now";
}
