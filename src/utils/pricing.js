export function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function formatPrice(value) {
  if (!value) return "";
  return `NGN ${Number(value).toLocaleString()}`;
}

export function getLowestRoomPricing(item) {
  const rooms = Array.isArray(item?.rooms) ? item.rooms : [];
  let lowestOriginal = null;
  let lowestDiscountedCurrent = null;
  let originalForLowestDiscounted = null;

  rooms.forEach((room) => {
    const original = toNumber(room?.originalPrice);
    const current = toNumber(room?.currentPrice);
    const hasRoomDiscount =
      Boolean(room?.discount) || (original && current && current < original);

    const roomBaseOriginal = original || current;
    if (roomBaseOriginal && (!lowestOriginal || roomBaseOriginal < lowestOriginal)) {
      lowestOriginal = roomBaseOriginal;
    }

    if (hasRoomDiscount && original && current) {
      if (!lowestDiscountedCurrent || current < lowestDiscountedCurrent) {
        lowestDiscountedCurrent = current;
        originalForLowestDiscounted = original;
      }
    }
  });

  if (lowestDiscountedCurrent && originalForLowestDiscounted) {
    return {
      hasDiscount: true,
      originalPrice: originalForLowestDiscounted,
      currentPrice: lowestDiscountedCurrent,
    };
  }

  const fallbackOriginal =
    lowestOriginal ||
    toNumber(item?.originalPrice) ||
    toNumber(item?.currentPrice);

  return {
    hasDiscount: false,
    originalPrice: fallbackOriginal,
    currentPrice: null,
  };
}
