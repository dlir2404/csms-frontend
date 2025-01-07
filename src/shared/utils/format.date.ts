import moment from "moment"

export const formatDate = (iso: string) => {
    return moment(iso).format("HH:mm:ss DD/MM/YYYY");
}

export const formatVNPDate = (dateString: string) => {
    if (dateString.length !== 14) {
      throw new Error('Invalid date format. Expected yyyyMMddHHmmss.')
    }
  
    const year = parseInt(dateString.slice(0, 4), 10)
    const month = parseInt(dateString.slice(4, 6), 10) - 1 // Months are 0-indexed in JS
    const day = parseInt(dateString.slice(6, 8), 10)
    const hour = parseInt(dateString.slice(8, 10), 10)
    const minute = parseInt(dateString.slice(10, 12), 10)
    const second = parseInt(dateString.slice(12, 14), 10)
  
    const date = new Date(year, month, day, hour, minute, second)
  
    return formatDate(date.toISOString())
  }