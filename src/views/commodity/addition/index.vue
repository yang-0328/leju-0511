<template>
  <div class="addinion">
    <el-card class="search-box card">
      <div slot="header">
        <span>条件查询</span>
      </div>

      <el-col :gutter="30">
        <el-col :span="6">
          <el-input size="small" v-model="search.gname" placeholder="商品名称/模糊查询"></el-input>
        </el-col>

        <el-col :span="6">
          <el-input size="small" v-model="search.pcode" placeholder="商品编码"></el-input>
        </el-col>

        <el-col :span="6">
          <el-select v-model="search.brandId" size="small" clearable placeholder="品牌">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.cname"
              :value="item.id"
            />
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-select v-model="search.kindId" size="small" clearable placeholder="分类">
            <el-option
              v-for="item in kindList"
              :key="item.id"
              :label="item.ctitle"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-col>

      <el-col :span="6" :offset="18" class="btn-group">
        <el-button type="primary" size="mini" @click="doReset">查询</el-button>
        <el-button type="primary" size="mini" @click="doSearch">重置</el-button>
      </el-col>
    </el-card>

    <el-card>
      <el-table :data="productList" border style="width: 100%">
        <el-table-column fixed="left" prop="gname " align="center" label="商品圖片" width="180">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover_img" />
          </template>
        </el-table-column>

        <el-table-column prop="descr" align="center" label="商品名称" width="200">
          <template slot-scope="scope">
            <p>{{scope.row.gname}}</p>
            <p>品牌: {{ scope.row.brandName }} {{ scope.row.brandEname }}</p>
            <p>{{ scope.row.descr }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="city" align="center" label="标签" width="150">
          <template slot-scope="scope">
            <p>
              上架:
              <el-switch
                v-model="scope.row.isshow"
                :active-value="1"
                :inactive-value="0"
                @change="switchCode('isshow',scope.row.isshow,scope.row.id)"
              />
            </p>
            <p>
              最热:
              <el-switch
                v-model="scope.row.ishot"
                :active-value="1"
                :inactive-value="0"
                @change="switchCode('ishot',scope.row.ishot,scope.row.id)"
              />
            </p>
            <p>
              最新:
              <el-switch
                v-model="scope.row.isnew"
                :active-value="1"
                :inactive-value="0"
                @change="switchCode('isnew',scope.row.isnew,scope.row.id)"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="价格货号" width="300" align="center">
          <template slot-scope="scope">
            <p>价格: 💴{{scope.row.price_now}}</p>
            <p>货号:{{scope.row.pcode}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属分类" width="120">
          <template slot-scope="scope">
            <p>{{scope.row.ctitles}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="查看sku" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="showSkuList(scope.row)">查看sku</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="sort" label="排序" width="120"></el-table-column>
        <el-table-column align="center" prop="origin_city" label="原产地" width="120"></el-table-column>
        <el-table-column align="center" prop="addtime" label="添加时间" width="180"></el-table-column>

        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button @click="goEdit(scope.row.id)" type="primary" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      align="right"
      :page="page"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="page.pageSplit"
      :page-size="page.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
    ></el-pagination>
    <!-- sku弹窗 -->
    <el-dialog :title="tempSkuObj.title" :visible.sync="dialog" style="width: 100%">
      <el-table :data="tempSkuObj.skuList" border stripe>
        <el-table-column align="center" prop="color_text" label="颜色" width="180"></el-table-column>
        <el-table-column prop="color" align="center" label="色值" width="180"></el-table-column>
        <el-table-column prop="sku_code" align="center" label="编码" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sku_code" placeholder="自定义sku编码"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="price" align="center" label="价格" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" placeholder="价格: 单位 /分"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="count" align="center" label="库存" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.count" placeholder="库存"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="doSaveSku(scope.row)" type="text" size="small">确认提交</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import skuApi from "@/api/commodity/sku";
import kindApi from "@/api/kind";

// 查询
import { resetData } from "@/utils/index";

import brandApi from "@/api/brand";
import productApi from "@/api/commodity/commodity";
import _ from "lodash";
export default {
  name: "addition",
  props: {},
  data() {
    return {
      search: {},
      productList: [],
      brandList: [],
      //   brandListAll: [],
      kindList: [],
      dialog: false,
      input: "",
      tempSkuObj: {
        title: "",
        id: "",
        skuList: []
      },

      page: {
        pageSplit: [10, 20, 30],
        start: 1,
        limit: 10,
        totalCount: 0,
        totalPage: 0
      }
    };
  },
  computed: {},
  created() {
    this.getBrandListAll();
    this.getProductList();
    this.getKindList();
  },

  methods: {
    //   编辑
    goEdit(id) {
      this.$router.push({ name: "productEdit", params: { id } });
    },
    getKindList() {
      kindApi.kindList().then(res => {
        this.kindList = res.data;
      });
    },
    //  查询重置
    doSearch() {
      this.search = {};
      this.getProductList();
    },

    // 查询
    doReset() {
      // 分页数据应该重置
      resetData(this, "page");
      this.getProductList();
    },

    //   sku查询
    showSkuList(row) {
      this.dialog = true;

      skuApi
        .skuList({
          productId: row.id
        })
        .then(res => {
          this.tempSkuObj = {
            id: row.id,
            title: row.gname,
            skuList: res.data
          };
        });
    },

    getProductList() {
      this.loading = true;

      let params = {
        ...this.search,
        start: this.page.start,
        limit: this.page.limit
      };

      params = _.pickBy(params, item => item);
      productApi.productList(params).then(res => {
        this.loading = false;
        this.productList = res.data.list;
        this.page.totalCount = res.data.totalRow;
      });
    },

    handleSizeChange(v) {
      this.page.limit = v;
      this.getProductList();
    },
    handleCurrentChange(v) {
      this.page.start = v;
      this.getProductList();
    },

    getBrandListAll() {
      brandApi.brandListAll().then(res => {
        this.brandList = res.data;
      });
    },

    _resetPage(res) {
      if (res) {
        this.page.start = res.pageNumber;
        this.page.limit = res.pageSize;
        this.page.totalCount = res.totalRow;
      } else {
        resetData(this, "page");
      }
    },
    doSaveSku(sku) {
      skuApi.saveOrUpdate(sku).then(res => {
        if (res.code == "success") {
          this.$message.success("更新成功");
        } else {
          this.$message.error("更新失败");
        }
      });
    },
    // 上架
    switchCode(code, v, id) {
      var obj = {
        id
      };
      obj[code] = v;
      productApi.switchCode(obj).then(res => {
        // 提醒
        if (res.code == "success") {
          this.$message.success("更新成功");
        } else {
          this.$message.error("更新失败");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.addinion {
  margin: 50px;
  .img {
    width: 100px;
    height: 100px;
    align-content: center;
  }
  .block {
    float: right;
    margin-top: 20px;
    // margin-right: ;
    margin-left: 50px;
  }
  .search-box {
    .el-input {
      width: 200px;
      display: flex;
    }

    .btn-group {
      margin-top: 30px;
      text-align: right;
      box-sizing: border-box;
    }
  }
}
</style>
