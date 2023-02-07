export function generateReferenceCode(type: string): string {
  let letters = type.slice(0, 2).toUpperCase();
  if (letters.length < 3) {
    const randomLetter = String.fromCharCode(
      Math.floor(Math.random() * 26) + 65
    );
    letters += randomLetter.repeat(3 - letters.length);
  }

  const numbers = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");

  return `${letters}-${numbers}`;
}
