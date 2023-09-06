<template>
</template>
<script>
export default {
  name: "refresh",
  beforeRouteEnter(to, from, next) {
    next((instance) => {
      instance.$router.replace({
        name: from.name,
        query: to.query
      });
    })
  },
};
</script>
