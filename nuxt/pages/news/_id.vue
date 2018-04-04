<template>
  <div>
    <h2>news_content</h2>
    <p>newsId:{{$route.params.id}}</p>
    <ul>
      <li><a href="/">HOME</a></li>
    </ul>
  </div>
</template>
<script>
export default {
  valiate({params}){
    //校验只有数字才能进入
    return /^\d+$/.test(params.id);
  }
}
</script>
