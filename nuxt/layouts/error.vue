<template>
  <h2 v-if="error.statusCode==404">404,您要的页面没有找到</h2>
  <h2 v-else>500,服务器出错啦</h2>
</template>

<script>
export default {
  props: ['error']
}
</script>

