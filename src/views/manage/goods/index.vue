<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入用户名称" style="max-width: 180px"> </el-input>
        <el-button size="default" type="primary" class="ml10">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增用户
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="title" label="商品描述" show-overflow-tooltip></el-table-column>
        <el-table-column
            prop="pic"
            label="商品图片">
          <template v-slot="scope">
            <el-image
                style="width: 50px; height: 50px; margin-bottom:-4px"
                :src='scope.row.pic'
                :zoom-rate="1.2"
                :preview-src-list="[scope.row.pic]"
                preview-teleported
                fit="cover"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="point" label="所需积分" show-overflow-tooltip></el-table-column>
        <el-table-column prop="stocks" label="库存" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creat_time" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="update_time" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
            >修改</el-button
            >
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="state.tableData.param.pageNum"
          background
          v-model:page-size="state.tableData.param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.tableData.total"
      >
      </el-pagination>
    </el-card>
    <UserDialog ref="userDialogRef" @refresh="getTableData()" />
  </div>
</template>

<script setup lang="ts" name="userManage">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import request from "/@/utils/request";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/manage/goods/dialog.vue'));
// 定义变量内容
const userDialogRef = ref();
const state = reactive<SysUserState>({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
  },
});
//查询所有用户
const allUser = () => {
  return request({
    url: "/",
    method: "get",
  });
};
// 初始化表格数据
const getTableData = () => {
  // allUser().then(res=>{
  //   console.log(res.data)
  //   const data=res.data
  // })
  state.tableData.loading = true;
  const data = [];
  for (let i = 0; i < 2; i++) {
    data.push({
      title: i === 0 ? '妙洁 清洁洗衣洗碗家务做饭橡胶手套' : '立白椰油精华洗衣皂',
      pic: i === 0 ? 'https://keesuishoupai.ylkee.top/uploads/20220515/b2bf12c2db5e16f8ffa389521dc231dd.jpg' : 'https://keesuishoupai.ylkee.top/uploads/20220515/3ea9a0d32db2b411761b5881e89e639a.jpg',
      point: i === 0 ? 5 : 10,
      stocks: 99,
      creat_time:'2023-5-1',
      update_time: new Date(),
    });
  }
  state.tableData.data = data;
  state.tableData.total = state.tableData.data.length;
  setTimeout(() => {
    state.tableData.loading = false;
  }, 500);
};
// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
  userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type: string, row: RowUserType) => {
  userDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: RowUserType) => {
  ElMessageBox.confirm(`此操作将永久删除商品：“${row.userNickname}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        getTableData();
        ElMessage.success('删除成功');
      })
      .catch(() => {});
};
// 分页改变
const onHandleSizeChange = (val: number) => {
  state.tableData.param.pageSize = val;
  getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNum = val;
  getTableData();
};
// 页面加载时
onMounted(() => {
  getTableData();
});
</script>

<style scoped lang="scss">
.system-user-container {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .el-table {
      flex: 1;
    }
  }
}
</style>
