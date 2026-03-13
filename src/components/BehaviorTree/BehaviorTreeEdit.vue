<template>
  <div>
    <el-form :model="behaviorTree" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="行为树名称" prop="name">
        <el-input v-model="behaviorTree.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="行为树描述" prop="desc">
        <el-input v-model="behaviorTree.desc" autocomplete="off" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BehaviorTreeEdit',
  data() {
    return {
      behaviorTree: {
      }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>