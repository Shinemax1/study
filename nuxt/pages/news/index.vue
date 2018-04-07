<template>
  <div>
    <h2>NEWS INDEX PAGE</h2>
    <p>newsId:{{$route.params.newsId}}</p>
    <ul>
      <li><a href="/">HOME</a></li>
      <li><nuxt-link :to="{name:'news-id',params:{id:234,title:'this is shinemax'}}">news-1</nuxt-link></li>
      <li><a href="/news/cxf">news-2</a></li>
    </ul>
  </div>
</template>
