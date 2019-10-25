<template>
  <div v-if="game" class="container">
    <div class="logo">Palash's Bingo</div>
    <transition name="fade" mode="out-in">
      <div v-if="game.u != 'start'" class="board">
        <div class="numbers">
          <div
            v-for="i in 90"
            :key="i"
            :class="['box', { selected: (game.called && game.called.includes(i)) }]"
          >
            <span>{{ pad(i) }}</span>
          </div>
        </div>
        <div class="right">
          <div class="flex current-number">
            <h3>Current Number</h3>
            <h1>{{ pad(game.currentNumber) }}</h1>
          </div>
          <div class="flex rounds">
            <h3>Calls</h3>
            <h1>{{ pad(game.rounds) }}</h1>
          </div>
        </div>
      </div>
      <div v-else class="qr">
        <qrcode-vue :value="hostUrl" :size="300" :background="'#0d0d0d'" :foreground="'#fff'"></qrcode-vue>
      </div>
    </transition>
  </div>
</template>

<script>
import { gamesRef } from "../firebase";
import { pad } from "../utils";
import QrcodeVue from "qrcode.vue";

export default {
  data() {
    return {
      game: null
    };
  },
  computed: {
    hostUrl() {
      return `${location.protocol}//${location.host}/host/${this.$route.params.game_id}`;
    }
  },
  watch: {
    "$route.params.game_id": {
      deep: true,
      immediate: true,
      handler(game_id) {
        let game = gamesRef.child(game_id);
        game.once("value", snapshot => {
          if (snapshot.exists()) {
            this.$rtdbBind("game", game);
          } else {
            this.init();
          }
        });
      }
    }
  },
  mounted() {
    if (!this.$route.params.game_id) {
      this.init();
    }
  },
  methods: {
    init() {
      let game = gamesRef.push({
        u: "start",
        currentNumber: 0,
        rounds: 0
      });
      this.$router.push(`/board/${game.key}`);
    },
    pad
  },
  components: {
    QrcodeVue
  }
};
</script>

<style lang="scss" scoped>
.board {
  height: 90%;
  width: 90%;
  display: flex;
  margin: auto;
  .numbers {
    flex: 1;
    background: var(--board-numbers-color);
    font-weight: 100;
    display: grid;
    grid-template: repeat(9, 1fr) / repeat(10, 1fr);
    position: relative;
    .box {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--board-text-color);
      font-size: 4vmin;
      &.selected span {
        animation: flash 0.4s forwards;
        animation-iteration-count: 2;
      }
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--board-current-color);
    .flex {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .rounds {
      background: var(--board-rounds-color);
    }
    h1 {
      font-size: 18vmin;
      color: var(--board-main-color);
      text-align: center;
      font-weight: 400;
    }
    h3 {
      color: var(--board-text-color);
      font-size: 4.6vmin;
      text-align: center;
      font-weight: 300;
    }
  }
}
.qr {
  margin: auto;
  text-align: center;
}
@keyframes flash {
  from {
    color: var(--board-text-color);
  }
  to {
    color: var(--board-main-color);
  }
}
@media only screen and (max-width: 800px) {
  .board {
    flex-direction: column;
    .right {
      flex-direction: row;
      order: -1;
      flex: 0;
      .flex {
        padding: 20px 0;
      }
    }
    .numbers .box {
      font-size: 16px;
    }
  }
}
</style>
