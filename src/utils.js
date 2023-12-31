import moment from 'moment-timezone';

export function calculateTimeLeftMS(timezone) {
    const newYearLocal = moment.tz('2024-01-01 00:00:00', timezone);
    const nowLocal = moment.tz(timezone);
    const difference = newYearLocal.diff(nowLocal);

    return {
        totalMilliseconds: Math.floor(difference / 1000) * 1000,
        formatted: formatTimeLeftString(difference),
    };
}


/* */

export function mergeTimezones(cities) {
    if (!cities.find((city) => !!city.timeLeft?.totalMilliseconds)) return cities;
    const left = [...new Set(cities.map((city) => city.timeLeft?.totalMilliseconds))];
    return left.map((timeLeft) => {
        const filtered_cities = cities.filter((city) => city?.timeLeft?.totalMilliseconds < timeLeft+1000 && city?.timeLeft?.totalMilliseconds > timeLeft-1000);
        const merged = {
            ...filtered_cities[0],
            timeLeft: {
                ...filtered_cities[0].timeLeft,
                formatted: formatTimeLeftString(timeLeft),
            },
            name: filtered_cities.map((city) => city.name).join(', '),
            timezone: filtered_cities.map((city) => city.timezone).join(', '),
        };
        return merged;
    });
}

  export function formatTimeLeft(difference) {
    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        };
    }
  
    export function formatTimeLeftString(difference) {
        if (difference.totalMilliseconds <= 0) return 'Happy New Year!';
      
        const { days, hours, minutes, seconds } = formatTimeLeft(difference.totalMilliseconds);
        
        // Construct the time string conditionally.
        let timeString = '';
      
        if (days > 0) {
          timeString += `${days}d `;
        }
        if (hours > 0) {
          timeString += `${hours}h `;
        }
        if (minutes > 0) {
          timeString += `${minutes}m `;
        }
        if (seconds >= 0) { // Even if seconds are 0, we want to show them.
          timeString += `${seconds}s`;
        }
        
        return timeString.trim();
      }
      