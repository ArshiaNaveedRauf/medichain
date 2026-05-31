export function truncateAddress(address, front = 6, back = 4) {
  if (!address) return "";
  return `${address.slice(0, front)}...${address.slice(-back)}`;
}

export function formatTimestamp(ts) {
  const ms = typeof ts === "bigint" ? Number(ts) * 1000 : Number(ts) * 1000;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

export function formatDate(ts) {
  const ms = typeof ts === "bigint" ? Number(ts) * 1000 : Number(ts) * 1000;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(ms));
}

export function dateInputToTimestamp(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
