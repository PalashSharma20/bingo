<template>
  <div v-if="jokes && game && game.u != 'start'" class="container">
    <div class="logo">Palash's Bingo</div>
    <div class="host_wrapper">
      <div class="host col">
        <h2>{{ currentJoke }}</h2>
        <h3>{{ pad(game.currentNumber) }}</h3>
      </div>
      <div class="buttons col">
        <button class="button" @click.prevent="nextNum">Next Number</button>
        <button class="button" @click.prevent="reset">Reset</button>
        <div id="joke-type" @click="jokeSettings.menuVisible = !jokeSettings.menuVisible">
          <div class="selection">Nicknames: {{ jokeSettings.types[jokeSettings.type] }}</div>
          <transition name="fade">
            <div class="menu" v-if="jokeSettings.menuVisible">
              <div
                v-for="(type, i) in jokeSettings.types"
                :key="i"
                class="item"
                @click.prevent="jokeSettings.type = i"
              >{{ type }}</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { value, computed, onMounted } from "vue";
import { auth, gamesRef } from "../firebase";
import { shuffle, pad } from "../utils.js";

export default {
  data() {
    return {
      game: null,
      numbers: [],
      jokeSettings: {
        types: ["Indian", "British"],
        type: 1,
        menuVisible: false
      },
      jokes: []
    };
  },
  computed: {
    gameId() {
      return this.$route.params.game_id;
    },
    currentJoke() {
      let joke = this.jokes[this.game.currentNumber];
      if (Array.isArray(joke)) {
        joke = joke[this.jokeSettings.type];
      }
      if (!joke) {
        joke = "No Pun";
      }
      return joke;
    }
  },
  mounted() {
    fetch("/static/jokes.json")
      .then(res => res.json())
      .then(res => (this.jokes = res.jokes));

    auth.signInAnonymously();
    auth.onAuthStateChanged(user => {
      if (user) {
        gamesRef.child(this.gameId).once("value", g => {
          if (g.exists()) {
            this.game = g.val();
            this.game.called = g.called || [];
            this.game.u = user.uid;
            this.update({
              u: user.uid
            });
            this.init();
          }
        });
      }
    });
  },
  methods: {
    init() {
      this.numbers = [...Array(90).keys()]
        .map(v => 1 + v)
        .filter(n => !this.game.called.includes(n));
    },
    nextNum() {
      if (this.numbers.length > 0) {
        let randomNumber = Math.floor(Math.random() * this.numbers.length),
          calledNumber = parseInt(this.numbers[randomNumber]);
        this.numbers.splice(randomNumber, 1);
        this.numbers = shuffle(this.numbers);
        this.game.currentNumber = calledNumber;
        this.game.called.push(calledNumber);
        this.game.rounds++;
        this.update();
      }
    },
    reset() {
      this.game.called = [];
      this.game.rounds = 0;
      this.game.currentNumber = 0;
      this.init();
      this.update();
    },
    update(update = this.game) {
      gamesRef.child(this.gameId).update(update);
    },
    pad
  }
};
</script>

<style lang="scss" scoped>
.host_wrapper {
  position: fixed;
  top: 11vmin;
  left: 0;
  height: calc(100% - 11vmin);
  width: 100%;
  display: flex;
}
.col {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5%;
}
.host {
  flex: 1;
}
.host h2,
.host h3 {
  width: 100%;
  padding: 0 5%;
  text-align: center;
  text-transform: capitalize;
}
.host h2 {
  font-size: 10vmin;
  font-weight: 100;
  color: var(--board-text-color);
}
.host h3 {
  font-size: 16vmin;
  font-weight: 900;
  color: var(--board-main-color);
}
#joke-type,
.buttons .button {
  text-align: center;
  text-transform: uppercase;
  width: 100%;
  padding: 3vmin 3vmax;
  margin: 2vmin 0;
  font-size: 2.6vmin;
  border: none;
  background: var(--board-numbers-color);
  color: var(--board-main-color);
  border-radius: 3px;
  outline: 0;
  cursor: pointer;
}
.buttons .button:hover {
  background: #111;
}
#joke-type {
  position: relative;
  width: 100%;
  background: var(--board-numbers-color);
}
#joke-type .menu {
  top: 0;
  position: absolute;
  background: #000;
  color: #fff;
  width: 100%;
  left: 0;
  border-radius: 3px;
}
#joke-type .menu .item {
  padding: 3vmin 3vmax;
}
#joke-type .menu .item:hover {
  background: rgba(255, 255, 255, 0.01);
  color: var(--board-main-color);
}
.board_url {
  position: relative;
  width: 100%;
}
.board_url input {
  letter-spacing: 0.04vw;
  display: block;
  width: 100%;
  padding: 3vmin 1vmax;
  margin: 2vh 0;
  font-size: 2.6vmin;
  outline: 0;
  cursor: pointer;
  border: none;
  font-weight: 400;
  background: var(--board-numbers-color);
  color: var(--board-main-color);
  border-radius: 3px;
}
.board_url label {
  color: var(--board-text-color);
}
@media only screen and (max-width: 600px) {
  .host_wrapper {
    flex-direction: column;
  }
  .col {
    width: 100%;
    min-height: 30%;
    height: auto;
  }
  .col.buttons {
    flex: 0;
  }
  #joke-type .menu {
    top: -100%;
  }
}
</style>
