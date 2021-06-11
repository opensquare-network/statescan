export function addressEllipsis(address, start = 4, end = 4) {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
