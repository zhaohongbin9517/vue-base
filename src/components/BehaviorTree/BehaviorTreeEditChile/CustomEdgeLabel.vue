<template>
  <tspan dy="10" x="0">{{ label }}</tspan>
</template>

<script>
export default {
  name: 'CustomEdgeLabel',
  props: {
    label: {
      type: String,
      required: true,
    },
  }
}
</script>