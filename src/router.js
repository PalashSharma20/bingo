import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

const Board = () => import(/* webpackChunkName: "board" */ "./views/Board.vue")

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "ticket",
      component: () =>
        import(/* webpackChunkName: "ticket" */ "./views/Ticket.vue")
    },
    {
      path: "/play",
      redirect: "/board"
    },
    {
      path: "/board",
      name: "new-game",
      component: Board
    },
    {
      path: "/board/:game_id",
      name: "game",
      component: Board
    },
    {
      path: "/host/:game_id",
      name: "host-game",
      component: () => import(/* webpackChunkName: "host" */ "./views/Host.vue")
    }
  ]
})
