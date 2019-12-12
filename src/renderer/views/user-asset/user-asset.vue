<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.supervise_bank_acco" placeholder="申请编号" class="filter-item" style="width:100px" />
      <el-input v-model="listQuery.sp_trans_id" placeholder="申请编号" class="filter-item" style="width:100px" />
      <el-input v-model="listQuery.real_name" placeholder="申请编号" class="filter-item" style="width:130px" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownloadAll">
        全部导出
      </el-button>
    </div>
    
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      height="1000"
      border
      highlight-current-row
      style="width: 100%;"
    >
    

    <el-table-column prop="real_name" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="amount" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="bank_acco" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="bank_name" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="frozen" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="id_card" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="sp_trans_id" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="supervise_bank_acco" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="ta_acco" label="交易账号" width="110px" align="center">
    </el-table-column>
    <el-table-column prop="total_bonus" label="交易账号" width="110px" align="center">
    </el-table-column>
    
      
      

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList } from '@/api/user-asset'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  directives: { waves },
  filters: {},
  data () {
    return {
      myTime: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        supervise_bank_acco: undefined,
        real_name: undefined,
        sp_trans_id: undefined,
        request_no: undefined,
        out_trade_no: undefined,
        sort: '+id',
        open_time_range: undefined,
        confirm_time_range: undefined,
        env: process.env.NODE_ENV

      },
      downloadLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        console.log(response.data.items)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(err => {
        console.log('catch ' + err)
      })
    },

    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['基金账号', '交易账号', '交易账户名称', '客户编号', '证件号码', '份额余额', '冻结份额', '银行名称', '累计收益', '银行卡号']
        const filterVal = ['ta_acco', 'sp_trans_id', 'real_name', 'supervise_bank_acco', 'id_card', 'amount', 'frozen', 'bank_name', 'total_bonus', 'bank_acco']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'user-list'
        })
        this.downloadLoading = false
      })
    },
    handleDownloadAll () {
      this.downloadLoading = true
       import('@/vendor/Export2Excel').then(excel => {
         const tHeader = ['基金账号', '交易账号', '交易账户名称', '客户编号', '证件号码', '份额余额', '冻结份额', '银行名称', '累计收益', '银行卡号']
         const filterVal = ['ta_acco', 'sp_trans_id', 'real_name', 'supervise_bank_acco', 'id_card', 'amount', 'frozen', 'bank_name', 'total_bonus', 'bank_acco']
         // 去除page limit
         const listQueryData = JSON.parse(JSON.stringify(this.listQuery, function (key, value) {
           if (key === 'page' || key === 'limit') {
             return undefined
           } else {
             return value
           }
         }))
         fetchList(listQueryData).then(response => {
           const data = this.formatJson(filterVal, response.data.items)
           excel.export_json_to_excel({
             header: tHeader,
             data,
             filename: 'user-list-all'
           })
           this.downloadLoading = false
         })
       })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
