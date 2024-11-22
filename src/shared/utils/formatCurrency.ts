export function formatCurrency(value: number | string): string {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
  
    if (isNaN(value)) {
      return 'Invalid number';
    }
  
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}