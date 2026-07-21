import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date | undefined): string {
    if (!value) return '';

    const d = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));

    if (seconds <= 45) return 'Just now';
    if (seconds <= 90) return 'A minute ago';
    if (minutes <= 45) return `${minutes} minutes ago`;
    if (minutes <= 90) return 'An hour ago';
    if (hours <= 22) return `${hours} hours ago`;
    if (hours <= 36) return 'A day ago';
    
    return `${days} days ago`;
  }
}