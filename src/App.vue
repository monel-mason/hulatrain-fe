<template>
  <div id="app">
    <div id="nav">
      |
      <router-link to="/">Param</router-link> |
      <router-link to="/categorize">Cat</router-link> |
      <router-link to="/filter">Filter</router-link> |
      <router-link to="/mask">Mask</router-link> |
    </div>
    <router-view/>
    <footer class="footer">
      <div class="content has-text-left">
        <p>
          <b>Message</b>: <i :style="{ color : messageColor}"  >{{message}}</i>
        </p>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapState} from "vuex";

export default {
  computed: {
    ...mapState(["message","messageColor"])
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.footer {
  position: fixed;
  bottom: 0 ;
  right: 0 ;
  padding: 10px !important;
  width: 40%;
  background-color: red;
  height:50px;
}
</style>
