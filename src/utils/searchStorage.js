const KEY = "ibooknova_search";

export function saveSearch({ destination, checkIn, checkOut, adults, children, rooms }) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        destination: destination || "",
        checkIn: checkIn instanceof Date ? checkIn.toISOString() : checkIn || null,
        checkOut: checkOut instanceof Date ? checkOut.toISOString() : checkOut || null,
        adults: adults ?? 2,
        children: children ?? 0,
        rooms: rooms ?? 1,
      })
    );
  } catch {}
}

export function loadSearch() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      destination: data.destination || "",
      checkIn: data.checkIn ? new Date(data.checkIn) : null,
      checkOut: data.checkOut ? new Date(data.checkOut) : null,
      adults: data.adults ?? 2,
      children: data.children ?? 0,
      rooms: data.rooms ?? 1,
    };
  } catch {
    return null;
  }
}
