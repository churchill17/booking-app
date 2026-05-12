export function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function formatPrice(value) {
  if (!value) return "";
  return `NGN ${Number(value).toLocaleString()}`;
}

export function getLowestRoomPricing(item) {
  const original = toNumber(item?.originalPrice);
  const current  = toNumber(item?.currentPrice);
  const hasDiscount = Boolean(original && current && current < original);

  return {
    hasDiscount,
    originalPrice: original,
    currentPrice: hasDiscount ? current : null,
  };
}
