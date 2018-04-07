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
	validate({ params }) {
		//校验只有数字才能进入
		return /^\d+$/.test(params.id);
	},
	data() {
		return {
			title: this.$route.params.title,
		};
	},
	head() {
		return {
      title: this.title,
      //hid不一样，不会覆盖之前的meta
			meta: [{ hid: 'description', name: 'description', content: 'this is shinemax' }],
		};
	},
};
</script>
