<template>
    <div class="page-404 flex flex-col items-center justify-center ">
        <img style="width:250px" class="mb-6" src="@/assets/images/404-error.png" alt="404 error">
        <h1 class=" text-6xl font-bold  text-blue-500 mb-4">Page Not Found</h1>
        <router-link class=" text-blue-700  underline" to="/">back to home page</router-link>
    </div>
</template>

<script>
    export default {
        name:"NotFound"
    }
</script>

<style lang="css" scoped>
    .page-404{
        height: calc(100vh - 70px);
    }
</style>