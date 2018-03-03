<template>
  <div>
    <h1>Message</h1>
    <p>Hello: {{ message }}</p>
  </div>
</template>


<script>
  export default {
    data() {
      return { message: 'World'};
    }
  }
</script>
