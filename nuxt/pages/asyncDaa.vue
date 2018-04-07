<template>
  <div>
    <h2>{{name}}</h2>
    <h2>{{info.name}}</h2>
    <h2>{{info.age}}</h2>
    <h2>{{info.sex}}</h2>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data () {
    return {
      name: "shinemax"
    }
  },
  async asyncData(){
    let {data} = await axios.get('https://api.myjson.com/bins/5ywn7');
    return {info: data};
  }
}
</script>

