export const getPublicId = (
  url: string,
  startKeyword: string
): string | null => {
  const startIndex = url.indexOf(startKeyword);
  if (startIndex === -1) return null;
  const publicId = url.substring(startIndex).replace(/\.[^/.]+$/, '');

  return publicId;
};
