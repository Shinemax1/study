<template>
    <div>
      <button @click="show=!show">
        toggle
      </button>
      <transition @before-enter="beforeEnter" :css="false" @enter="enter">
        <p v-if="show">HelloWorld</p>
      </transition>
    </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      color: 'red',
      msg: 'Welcome to Your Vue.js App',
      show: true
    }
  },
  methods:{
    beforeEnter(el){
      el.style.color = "#ff0000";
      console.log('红');
    },
    enter(el,done){
      console.log('绿');
      el.style.color = "#00ff00";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
