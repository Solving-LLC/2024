<template>
  <!-- Special Card for Closest Timezone -->
  <div v-if="closestCity" :class="['next', (closestCity.timeLeft.totalMilliseconds > 15 * 60 * 1000) ? 'soon' : 'very-soon']">
    <p class="next-caption">New Year 2024</p>
    <p class="next-cities">{{ closestCity.name }}</p>
    <p class="next-timezones">{{ closestCity.timezone }}</p>
    <p class="next-time-left">
      {{ formatTimeLeftString(closestCity.timeLeft) }}
    </p>
</div>

  <div class="upcoming">
    <!-- List of Other Timezones -->
    <div v-for="(city, index) in otherCities" :key="index" class="upcoming-item">
      <p class="upcoming-item-name">{{ city.name }}</p>
      <p class="upcoming-item-timezone">({{ city.timezone }})</p>
      <p class="upcoming-item-time-left">{{ formatTimeLeftString(city.timeLeft) }}</p>
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
div {
  background-color: #000;
  color: #fff;

}
/* Общие стили */
#app {
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  margin: 2vh auto;
  padding: 2vh 1vw;
}

/* Стили для специальной карточки ближайшего часового пояса */
.next {
  border: 1px solid #dee2e6;
  border-radius: 1vh;
  padding: 2vh 1vw;
  margin-bottom: 2vh;
  text-align: center;
}

.next.soon {
  background-color: #28a745 ; /* Желтый цвет для ближайшего часового пояса */
}

.next.very-soon {
  background-color: #cc2535; /* Красный цвет для ближайшего часового пояса */
}

.next-caption {
  font-size: 4vh; /* Увеличенный размер для заголовка */
  margin-bottom: 1vh;
}

.next-cities,
.next-timezones {
  font-size: 3vh; /* Шрифт для городов и часовых поясов */
  margin-bottom: 0.5vh;
}

.next-time-left {
  font-size: 3.5vh; /* Шрифт для обратного отсчёта */
  color: #fff; /* Зеленый цвет */
  font-weight: bold; /* Жирный шрифт для акцента */
  margin-bottom: 1vh;
}

/* Стили для списка остальных часовых поясов */
.upcoming {
  display: flex;
  flex-direction: column;
}

.upcoming-item {
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 1vh;
  padding: 1.5vh 1vw;
  margin: 1vh 0;
  font-size: 2vh;
  color: #212529;
}

.upcoming-item-name,
.upcoming-item-timezone,
.upcoming-item-time-left {
  margin-bottom: 0.5vh;
}

/* Адаптивные стили для экранов шире 1024px */
@media (min-width: 1024px) {
  #app {
    flex-direction: row;
    max-height: 100vh;
    padding: 0;
    margin: 0;
  }

  div, p {
    margin: 0;
    padding: 0;
  }

  .next {
    flex: 0 0 75%; 
  }

  .upcoming {
    flex: 0 0 25%; 
    overflow-x: hidden;
    overflow-y: scroll
  }
  
  .next-cities {
    font-size: 12vh;
    color: #fff;
    margin-bottom: 0.5vh;
    line-height: 30vh;
  }

  .next-caption {
    font-size: 6vh;
    color: #fff;
    margin-bottom: 1vh;
    line-height: 20vh;
  }

  .next-timezones {
    color: #eeeb;
    line-height: 20vh;
    font-size: 1.5vw;
    line-height: 15vh;
  }

  .next-time-left {
    line-height: 30vh;
    font-size: 20vh;
  }
}


</style>
