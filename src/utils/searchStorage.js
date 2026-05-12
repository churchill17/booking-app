const KEY = "ibooknova_search";

export function getDefaultDates(saved) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const savedIn  = saved?.checkIn  ? new Date(saved.checkIn)  : null;
  const savedOut = saved?.checkOut ? new Date(saved.checkOut) : null;

  const checkIn  = savedIn  && savedIn  >= today   ? savedIn  : today;
  const checkOut = savedOut && savedOut >  checkIn  ? savedOut : tomorrow;
  return { checkIn, checkOut };
}

export function saveSearch({ destination, checkIn, checkOut, adults, children, rooms }) {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        destination: destination || "",
        checkIn:  checkIn  instanceof Date ? checkIn.toISOString()  : checkIn  || null,
        checkOut: checkOut instanceof Date ? checkOut.toISOString() : checkOut || null,
        adults:   adults   ?? 2,
        children: children ?? 0,
        rooms:    rooms    ?? 1,
      })
    );
  } catch (e) {
    console.warn("saveSearch: could not write to sessionStorage", e);
  }
}

export function loadSearch() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      destination: data.destination || "",
      checkIn:  data.checkIn  ? new Date(data.checkIn)  : null,
      checkOut: data.checkOut ? new Date(data.checkOut) : null,
      adults:   data.adults   ?? 2,
      children: data.children ?? 0,
      rooms:    data.rooms    ?? 1,
    };
  } catch {
    return null;
  }
}
