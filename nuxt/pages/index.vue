<template>
  <div>
    <ul>
      <!-- <li><a href="/">HOME</a></li>
      <li><a href="/about">ABOUT</a></li>
      <li><a href="/news">NEWS</a></li> -->
      <li><nuxt-link :to="{name:'index'}">HOME</nuxt-link></li>
      <li><nuxt-link :to="{name:'about'}">ABOUT</nuxt-link></li>
      <li><nuxt-link :to="{name:'asyncDaa'}">asyncData</nuxt-link></li>
      <li><nuxt-link :to="{name:'news',params:{newsId:123}}">NEWS</nuxt-link></li>
      <img src="~static/favicon.jpg" alt="">
    </ul>
  </div>
</template>

<script>
export default {
  components: {},

};
</script>

<style>

</style>
