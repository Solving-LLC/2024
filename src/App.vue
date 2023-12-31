<template>
  <div id="app">
    <h1>New Year 2024 Countdown</h1>

    <!-- Special Card for Closest Timezone -->
    <div v-if="closestCity" class="closest-city">
      <h2>Up Next: {{ closestCity.name }} ({{ closestCity.timezone }})</h2>
      <p>
        {{ formatTimeLeftString(closestCity.timeLeft) }}
      </p>
    </div>

    <!-- List of Other Timezones -->
    <div v-for="(city, index) in otherCities" :key="index" class="city">
      {{ city.name }} ({{ city.timezone }})
      {{ formatTimeLeftString(city.timeLeft) }}
    </div>
  </div>
</template>

<script>
import cities from "./cities";
import {
  calculateTimeLeftMS,
  formatTimeLeftString,
  mergeTimezones,
} from "./utils"; // Remove unused import statement

export default {
  name: "App",
  mounted() {
    // Update time left every second
    this.updateTimeLeft();
    this.interval = setInterval(this.updateTimeLeft, 1000);
  },
  data() {
    return {
      allCities: cities.map((city) => ({
        ...city,
        timeLeft: calculateTimeLeftMS(city.timezone),
      })),
    };
  },
  computed: {
    // Sort cities by time left and find the closest one
    sortedCities() {
      return [...this.allCities]
        .filter((city) => city.timeLeft && city.timeLeft.totalMilliseconds > 0) // Consider only future dates
        .sort((a, b) => {
          // Primary sort based on time left
          const timeDiff = Math.floor(
            (a.timeLeft.totalMilliseconds - b.timeLeft.totalMilliseconds) / 1000
          );
          if (timeDiff !== 0) return timeDiff;

          // Secondary sort based on city name when time left is the same
          return a.name > b.name ? 1 : -1;
        });
    },
    mergedCities() {
      return mergeTimezones(this.sortedCities);
    },
    closestCity() {
      return this.mergedCities.find((city) => city.timeLeft !== null);
    },
    otherCities() {
      return this.mergedCities.filter((city) => city !== this.closestCity);
    },
  },

  methods: {
    formatTimeLeftString(timeLeft) {
      return formatTimeLeftString(timeLeft);
    },
    updateTimeLeft() {
      this.allCities = cities.map((city) => ({
        ...city,
        timeLeft: calculateTimeLeftMS(city.timezone),
      }));
    },
  },
};
</script>

<style>
/* Add styles as needed */
.closest-city {
  background-color: lightgreen; /* Highlight the closest city */
  padding: 10px;
  margin-bottom: 20px;
}

.city {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
