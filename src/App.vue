<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Pacifico|Heebo:100,300,400,900");
:root {
  --board-main-color: #ffc168;
  --board-text-color: #eee;
  --board-bg-color: #0d0d0d;
  --board-numbers-color: #1a1a1a;
  --board-rounds-color: #222;
  --board-current-color: #151515;
  --board-header-color: #262626;
}
* {
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
}
.disabled {
  pointer-events: none;
  -webkit-pointer-events: none;
}
body,
html {
  height: 100%;
}
body {
  background: var(--board-bg-color);
  font-family: "Heebo", sans-serif;
  overflow: hidden;
}
.container {
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-rows: 11vmin auto;
  .logo {
    width: 100%;
    font-weight: 900;
    text-align: center;
    font-family: "Pacifico", cursive;
    font-size: 6.5vmin;
    color: var(--board-main-color);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
