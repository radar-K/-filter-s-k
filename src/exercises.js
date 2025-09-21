// ====== Higher-order functions ======
export function hasOutOfStock(items) {
  // true om någon produkt är slut i lager
  return items.some((p) => !p.inStock);
}

export function allAffordable(items, max) {
  // true om alla produkter har pris <= max
  return items.every((p) => p.price <= max);
}

export function findByTag(items, tag) {
  // första produkt som innehåller taggen (case-insensitive)
  const wanted = String(tag).toLowerCase();
  return items.find((p) =>
    p.tags.some((t) => String(t).toLowerCase() === wanted)
  );
}

export function totalPrice(items) {
  // summan av alla price
  return items.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
}

export function sortByName(items, direction = "asc") {
  // NY array, sorterad på name
  const dir = direction === "desc" ? -1 : 1;
  return [...items].sort(
    (a, b) =>
      dir * a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

// ====== Regex ======
export function extractHashtags(text) {
  // ex: "Idag #frontend #Chas! #100DaysOfCode" => ["#frontend", "#Chas", "#100DaysOfCode"]
  const pattern = /#[\p{L}\p{N}_-]+/giu; // Unicode: bokstäver/siffror/_/-
  return String(text).match(pattern) || [];
}

export function isValidSwedishZip(code) {
  // giltigt svenskt postnummer: "12345" eller "123 45"
  return /^\d{3}\s?\d{2}$/.test(String(code).trim());
}

export function maskEmails(text) {
  // Maskera användardelen: behåll första tecknet + *** (u***@chas.se)
  // Hanterar flera e-postadresser i samma text
  const emailRegex =
    /([A-Za-z0-9._%+-])([A-Za-z0-9._%+-]*)(@[^\s@]+\.[A-Za-z]{2,})/g;
  return String(text).replace(
    emailRegex,
    (_m, first, _rest, domain) => `${first}***${domain}`
  );
}

// ====== Rekursion ======
export function deepCountTags(items) {
  // Räkna alla taggar oavsett hur djupt items är nästlat.
  let count = 0;
  const visit = (val) => {
    if (val == null) return;
    if (Array.isArray(val)) {
      for (const v of val) visit(v);
      return;
    }
    if (typeof val === "object") {
      if (Array.isArray(val.tags)) count += val.tags.length;
      for (const key in val) {
        if (key !== "tags") visit(val[key]);
      }
    }
  };
  visit(items);
  return count;
}

export function factorial(n) {
  // 0! = 1
  const x = Number(n);
  if (!Number.isInteger(x) || x < 0)
    throw new Error("factorial: n måste vara ett heltal ≥ 0");
  if (x === 0) return 1;
  return x * factorial(x - 1);
}

export function findByIdRecursive(items, id) {
  // Sök id var det än gömmer sig i objekt/arrayer
  const wanted = id;
  const visit = (val) => {
    if (val == null) return undefined;
    if (Array.isArray(val)) {
      for (const v of val) {
        const hit = visit(v);
        if (hit) return hit;
      }
      return undefined;
    }
    if (typeof val === "object") {
      if (val.id === wanted) return val;
      for (const key in val) {
        const hit = visit(val[key]);
        if (hit) return hit;
      }
    }
    return undefined;
  };
  return visit(items);
}

// ====== Functional programming ======
export function setInStock(items, id, value) {
  // Pure: returnera NY array + NYtt objekt för träffen
  return items.map((p) =>
    p.id === id ? { ...p, inStock: Boolean(value) } : p
  );
}

export function curry(fn) {
  // Enkel curry som använder fn.length (aritet)
  const arity = fn.length;
  const curried = (...args) =>
    args.length >= arity ? fn(...args) : (...rest) => curried(...args, ...rest);
  return curried;
}

export const priceAtMost = (max) => (item) => item.price <= max;
