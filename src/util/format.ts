/*!
 * Utility module exporting formatting
 * functions
 */

/**
 * Formats the given bytes to a human-readable format
 * using the 'B', 'KB', 'MB, etc. suffixes
 * @param bytes The bytes to format
 * @param baseUnit The base unit (i.e. 1000 or 1024)
 * @param decimals The numbers after the dot
 */
export function formatBytes(
  bytes: number,
  baseUnit = 1000,
  decimals = 2
) {

  const units = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];

  for (let i = 0; i < units.length; i++) {
    const suffix = units[i];
    const divisor = Math.pow(baseUnit, i);
    const max = divisor * baseUnit;

    if (bytes < max) {
      return (bytes / divisor).toFixed(decimals) + suffix;
    }
  }
}