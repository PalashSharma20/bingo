<template>
  <div class="ticket-container" :style="{ '--ticket-color': color }">
    <div v-if="matrix" class="ticket" ref="ticket">
      <div v-for="(row, i) in matrix" :key="i" class="row">
        <div
          v-for="(num, i) in row"
          :key="i"
          :class="['num', { chosen: num, selected: (num && num.selected) }]"
          @click="num ? (num.selected = !num.selected) : null"
          v-html="num ? num.number : ''"
        ></div>
      </div>
    </div>
    <div id="warning-message">
      <div class="message">
        <svg class="icon" version="1.0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0 1024) scale(.1 -.1)">
            <path
              d="m4871 10233-45-4 1639-1639 285 285 286 285 119-61c674-345 1268-875 1689-1509 290-436 487-880 611-1372 48-189 98-465 110-600l7-78h324 324v34c0 19-9 108-21 198-188 1486-1022 2818-2279 3640-194 127-325 201-548 312-698 344-1456 520-2217 514-132-1-260-3-284-5z"
            />
            <path
              d="m3814 9680c-86-13-180-49-256-100-102-67-2847-2814-2907-2909-65-102-94-204-94-336-1-128 17-205 70-310 34-66 205-239 2670-2706 1843-1844 2651-2646 2689-2669 30-18 85-44 122-58 61-24 81-26 212-27 165 0 227 15 341 84 85 51 2876 2840 2928 2925 125 207 125 470 0 683-26 44-645 670-2614 2639-1419 1420-2607 2605-2640 2634-138 121-334 177-521 150zm2659-3208 2557-2557-2705-2705-5120 5120 1350 1350c742 742 1352 1350 1355 1350s1156-1151 2563-2558z"
            />
            <path
              d="m20 4665c0-19 9-105 20-192 216-1701 1261-3173 2797-3941 585-293 1229-471 1892-522 147-11 557-12 634-2l47 7-817 818-818 817-568-568-111 55c-293 147-620 365-881 588-204 174-484 469-649 684-222 290-431 651-580 1004-144 340-281 874-311 1210l-7 77h-324-324v-35z"
            />
          </g>
        </svg>

        <p>This Website Is Only Viewable In Landscape Mode</p>
      </div>
    </div>
  </div>
</template>

<script>
import { value, onMounted } from "vue";
import { shuffle } from "../utils.js";

export default {
  data() {
    return {
      color: "",
      matrix: null
    };
  },
  mounted() {
    {
      let colors = [
        "00aeff",
        "3369e7",
        "8e43e7",
        "b84592",
        "ff4f81",
        "ff6c5f",
        "ffc168",
        "2dde98",
        "1cc7d0"
      ];
      this.color = `#${colors[Math.floor(Math.random() * colors.length)]}`;

      if (!this.$cookies.get("saved")) {
        this.matrix = [...Array(3).keys()].map(row => {
          row = [...Array(9).keys()].fill(true, 0, 5).fill(null, 5, 10);
          return shuffle(row);
        });

        let numbers = [...Array(90).keys()].map(v => 1 + v);

        this.matrix = this.matrix.map(row => {
          return row.map((num, i) => {
            if (num) {
              let filtered = numbers.filter(x => {
                let a = i * 10,
                  b = a + 9;
                if (i == 0) {
                  a = 1;
                } else if (i == 8) {
                  b = 90;
                }
                return x >= a && x <= b;
              });
              let index = Math.floor(Math.random() * filtered.length),
                element = filtered[index];
              numbers.splice(numbers.indexOf(element), 1);
              return {
                number: element,
                selected: false
              };
            }
          });
        });

        for (let i = 0; i < 9; i++) {
          let col = [this.matrix[0][i], this.matrix[1][i], this.matrix[2][i]]
            .filter(n => n != null)
            .sort((a, b) => a.number - b.number);
          for (let j = 0; j < 3; j++) {
            if (this.matrix[j][i] != null) {
              this.matrix[j][i] = col.shift();
            }
          }
        }

        this.$cookies.set("saved", JSON.stringify(this.matrix), 600);
      } else {
        this.matrix = JSON.parse($cookies.get("saved"));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ticket-container {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  user-select: none;
}
.ticket {
  height: 100%;
  width: 100%;
  background: #0000;
  display: flex;
  flex-direction: column;
  .row {
    flex: 1;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    text-align: center;
    font-size: 200%;
    font-weight: 100;
    .num {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 300;
      color: var(--ticket-color);
      border: 1px solid var(--ticket-color);
      &.chosen {
        cursor: pointer;
        &.selected {
          background-color: var(--ticket-color);
          color: #111;
        }
      }
    }
  }
}
#warning-message {
  display: none;
  position: relative;
  height: 100%;
  width: 100%;
  .message {
    position: absolute;
    left: 10vw;
    width: 80vw;
    top: calc(50% - 50vw);
    p {
      padding-top: 4vh;
      color: var(--ticket-color);
      text-align: center;
      font-weight: 400;
      font-size: 4vmin;
    }
    .icon {
      fill: var(--ticket-color);
      width: 50vw;
      height: 50vw;
      margin-left: 15vw;
    }
  }
}
@media only screen and (max-width: 600px) {
  .ticket {
    display: none;
  }
  #warning-message {
    display: block;
  }
}
@media only screen and (min-width: 601px) {
  #warning-message {
    display: none;
  }
}
</style>
