export async function fileToDataURL(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mime = file.type || 'application/octet-stream';
  return `data:${mime};name=${encodeURIComponent(file.name)};base64,${base64}`;
}
