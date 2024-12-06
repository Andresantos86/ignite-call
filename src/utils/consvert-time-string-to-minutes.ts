/**
 * @param timeString recebe valores no formato 00:00
 */
export function convertTimeStringInMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}
