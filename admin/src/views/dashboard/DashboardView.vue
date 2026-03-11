<template>
  <div>
    <a-page-header title="仪表盘" sub-title="系统概览" />
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="6">
        <a-card>
          <a-statistic title="注册用户" :value="128" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="今日活跃" :value="36" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="帖子总数" :value="256" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="投递记录" :value="512" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
