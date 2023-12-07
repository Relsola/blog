<template>
    <div class="loader"></div>
</template>
<style scoped>
.loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 8px solid;
    border-color: #409EFF #0000;
    animation: l1 1s infinite;
}

@keyframes l1 {
    to {
        transform: rotate(.5turn)
    }
}
</style>