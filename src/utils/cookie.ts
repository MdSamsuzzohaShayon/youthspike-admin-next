function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const popedPart = parts.pop();
    if (!popedPart) return null;
    const expectedCookie = popedPart.split(";").shift();
    if (!expectedCookie) return null;
    return expectedCookie;
  }
  return null;
}

export { getCookie };
