<template>
    <div class="get-started">
        <div class="get-started__wrapper">
            <h1>Auto MCQ Marker</h1>
            <p>
                Auto mcq marker is a platform which enables you to automatically correct
                MCQ sheets. You equally have the ability to create your own sheets and set mark allocations
                for questions on the sheets.<br/>
                Start by creating an answer sheet which you will use for you quiz. click on the button
                bellow.
            </p>
            
            <router-link to="/create-sheet" exact class="start-button">Get Started</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name:"GetStarted"
    }
</script>

<style lang="css" scoped>
    .get-started{
        display: flex;
        align-items: center;
        justify-content: center;
        height:85vh;
    }

    .get-started__wrapper{
        width:max-content;
    }

    h1{
        @apply font-bold;
        @apply text-3xl;
        margin-bottom: 30px;
    }

    p{
        max-width: 70%;
        margin: 0 auto;
        @apply text-justify;
        margin-bottom: 40px;


    }
    .start-button{
        color:white;
        background:#2f48ff;
        padding:20px 50px;
        border-radius: 4px;
        outline:none;
        border:none;
        transition:.3s;
        cursor: pointer;

    }
    .start-button:focus{
        outline:none;
    }
    .start-button:hover{
        background:#5c6ffd;

    }
</style>