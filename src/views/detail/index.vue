<template>
  <div class="detail-main">
    <el-steps :active="step" finish-status="success">
      <el-step title="商品基本信息"></el-step>
      <el-step title="添加库存信息"></el-step>
      <el-step title="添加关联"></el-step>
    </el-steps>

    <!-- 第一步 -->

    <el-card class="search-box card">
      <el-form ref="form" class="form" :model="form" label-width="80px">
        <div v-show="step==1" class="step-1">
          <el-col :gutter="20">
            <el-col :gutter="20">
              <el-col :span="6">
                商品名称
                <el-input v-model="form.gname" size="small"></el-input>
              </el-col>

              <el-col :span="6">
                品牌
                <el-select v-model="form.brand_id" size="small" placeholder>
                  <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.cname"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="6">
                原产地
                <el-cascader
                  size="large"
                  :options="cityOptions"
                  v-model="selectedCity"
                  placeholder="原产地"
                ></el-cascader>
              </el-col>
            </el-col>
            <el-col :gutter="20">
              <el-col :span="6">
                商品编码
                <el-input v-model="form.pcode" size="small" placeholder="商品名称/模糊查询"></el-input>
              </el-col>
              <el-col :span="6">
                关键词
                <el-input v-model="form.keywords" size="small" placeholder="商品名称/模糊查询"></el-input>
              </el-col>
              <el-col :span="6">
                商品描述
                <el-input v-model="form.descr" size="small" placeholder="商品名称/模糊查询"></el-input>
              </el-col>
            </el-col>

            <el-col :span="8">
              封面图片
              <el-upload
                class="upload-demo"
                action="http://bufantec.com/api/leju/admin/material/uploadImg"
                :on-success="coverSuccess"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-col>

            <!-- 图片展示 -->
            <el-col :span="6">
              <el-image class="corer-img" :src="form.cover_img">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-col>

            <el-col :gutter="20">
              <el-col :span="6">
                是否上架
                <el-switch v-model="form.isshow" active-value="1" inactive-value="0"></el-switch>
              </el-col>

              <el-col :span="6">
                是否最热
                <el-switch v-model="form.ishot" active-value="1" inactive-value="0"></el-switch>
              </el-col>

              <el-col :span="6">
                是否最新
                <el-switch v-model="form.isnew" active-value="1" inactive-value="0"></el-switch>
              </el-col>
            </el-col>

            <el-col :gutter="10">
              <el-col :span="7">
                进价
                <el-input-number v-model="form.price_in" :min="1" label="描述文字"></el-input-number>(单位/分)
              </el-col>
              <el-col :span="7">
                售价
                <el-input-number v-model="form.price_out" :min="1" label="描述文字"></el-input-number>(单位/分)
              </el-col>
              <el-col :span="7">
                当前价格
                <el-input-number v-model="form.price_now" :min="1" label="描述文字"></el-input-number>(单位/分)
              </el-col>
            </el-col>

            <el-col :gutter="10">
              <el-col :span="7">
                重量
                <el-input-number v-model="form.weight" :min="1" label="描述文字"></el-input-number>(单位/克)
              </el-col>
              <el-col :span="7">
                排序
                <el-input-number v-model="form.sort" :min="1" label="描述文字"></el-input-number>
              </el-col>
              <el-col :span="7">
                单位名称
                <el-input size="small" v-model="form.unit_name" placeholder="商品名称/模糊查询"></el-input>
              </el-col>
            </el-col>

            <el-col :gutter="10">
              <el-col :span="7">
                商品分类
                <el-checkbox-group v-model="form.kindIds" size="small">
                  <el-checkbox
                    v-for="item in kindList"
                    :key="item.id"
                    :label="item.id"
                  >{{ item.ctitle }}</el-checkbox>
                </el-checkbox-group>

                <!-- 下拉选择框  系类-->
              </el-col>
              <el-col :span="7">
                系列
                <el-select v-model="form.seriesId" placeholder="请选择">
                  <el-option
                    v-for="item in seriesList"
                    :key="item.id"
                    :label="item.cname"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <!-- 送货上门 -->
              <el-col :span="7">
                送货服务
                <el-checkbox-group v-model="form.service_promise">
                  <el-checkbox :label="0">无</el-checkbox>
                  <el-checkbox :label="1">送货入户</el-checkbox>
                  <el-checkbox :label="2">上门安装</el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-col>
          </el-col>
        </div>
      </el-form>

      <!-- 第二步 -->
      <div v-show="step==2" class="step-2">
        <el-form ref="form" class="form" :model="form" label-width="80px">
          <el-col :gutter="20">
            <el-col :span="6">
              详情标题
              <el-input v-model="form.detail_title" size="small"></el-input>
            </el-col>
            <el-col :span="6">
              副标题
              <el-input v-model="form.detail_desc" size="small"></el-input>
            </el-col>
          </el-col>
          <el-col :gutter="20">
            <el-col :span="6">
              轮播图片
              <el-upload
                class="upload-demo"
                action="http://bufantec.com/api/leju/admin/material/uploadImg"
                :on-success="detailImgsSuccess"
                :on-exceed="handleExceed"
                :limit=" 4"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb 一次上传不超过四张</div>
              </el-upload>
            </el-col>
            <el-col :span="6">
              <img v-for="m in form.imgs" :key="m" class="detail-img" :src="m" />
            </el-col>
          </el-col>
        <el-col :gutter="20">
           
            </el-col>
        
          <el-col :gutter="20">
                <el-checkbox-group v-model="colorSel">
                  <el-checkbox v-for="item in colorObjList" :key="item.value" :label="item.text">
                    <span :style="{color:item.value}">{{ item.text }}</span>
                    <span style="font-size:12px;" @click="delColor(item.text)">删除</span>
                  </el-checkbox>
                </el-checkbox-group>
            <p>
              添加sku
              <span>颜色</span>
            </p>
             
            <el-col :span="6">
              <el-input
                v-model="colorObj.text"
                size="small"
                style="width:160px"
                placeholder="颜色描述:比如土豪金"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="colorObj.value"
                size="small"
                style="width:160px"
                placeholder="色值:比如#ff0055"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-button @click="addColorObj" type="primary">创建</el-button>
            </el-col>
          </el-col>
   
              <div>
                <el-button
                  v-show="colorObjList"
                  type="small"
                  @click="createSkus"
                >{{ skuList.lenght>0?'重新生成':'生成' }}</el-button>
              </div>
              <el-table :data="skuList" border style="width: 100%">
                <el-table-column align="center" prop="color_text" label="颜色" width="100"></el-table-column>
                <el-table-column align="conter" prop="color" label="色值" width="100"></el-table-column>
                <el-table-column align="center" prop="sku_count" width="200" label="sku编码">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.sku_code" placeholder="请输入内容"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="价格" width="180">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.price" placeholder="请输入内容"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="库存" width="180">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.count" placeholder="请输入内容"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="removeSku(scope.row.tempId)" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
       
     
        </el-form>
      </div>
      <!-- 点击按钮 -->

      <div class="footer-btns">
        <el-button v-show="step>1" size="small" type="default" @click="preStep">返回上一步</el-button>

        <el-button v-show="step<3" size="small" type="primary" @click="nextStep">{{ nextBtnText }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import kindApi from "@/api/kind";
import seriesApi from "@/api/series";
import brandApi from "@/api/brand";
import productApi from "@/api/commodity/commodity";
import skuApi from "@/api/commodity/sku";
export default {
  props: {},
  data() {
    return {
      checkList: ["复选框 A"],

      value: 1,
      step: 1,
      options: regionDataPlus,
      selectedOptions: [],
      fileList: [],
      id: "",
      form: {
        isshow: "1",
        kindIds: [],
        service_promise: [],
        cover_img: "",
        imgs: []
      },
      seriesList: [],
      // fileList
      // 商品图片
      fileList: [],
   

      kindList: [],
      tableData: [],
      brandList: [],
      productList: [],
      selectedCity: [],
         colorObjList: [], //颜色对象
      colorObj: [],
            colorSel: [], // 选中的颜色集合
      skuList: [], // sku集合
      //   地址
      cityOptions: regionDataPlus
    };
  },
  computed: {
    nextBtnText() {
      var text = "";
      switch (this.step) {
        case 1:
          text = "下一步,填写库存信息";
          break;
        case 2:
          text = "下一步, 填写关联商品";
          break;
        default:
          break;
      }
      return text;
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.getBrandList();
    this.getProductList();
    this.getKindList();
    this.getSeriesList();
    this.getProductList();
    this.getProduct();
    // setTimeout(() => {
    // //   this.selectedCity = ['110000', '110100', '110102']
    // }, 2000)
    // if (this.id) {

    // }
  },
  mounted() {},
  watch: {},
  methods: {
    getProduct() {
      productApi
        .detail({
          id: this.id
        })
        .then(res => {
          // 对于数据格式 需要符合表单
          var rs = res.data;
          if (rs.imgs.indexOf(",") != -1) {
            rs.imgs = rs.imgs.split(",");
          }
          if (rs.kindIds.indexOf(",") != -1) {
            rs.kindIds = rs.kindIds.split(",");
          }

          this.form = rs;
          // 修改kindIds
          this.skuList = rs.skuList;
          // 重置原产地
          // 4101010  判断是第一位还是第二位还是第三位
          const selectCityUse = [];
          if (this.form.origin_code != "") {
            // 确定第一位
            const city_1_code = this.form.origin_code.substr(0, 2);
            // 确定 第二位
            const city_2_code = this.form.origin_code.substr(2, 2);
            // 确定第三位
            const city_3_code = this.form.origin_code.substr(4, 2);
            selectCityUse.push(city_1_code + "0000");
            if (city_2_code != "00") {
              selectCityUse.push(city_1_code + city_2_code + "00");
            }
            if (city_3_code != "00") {
              selectCityUse.push(city_1_code + city_2_code + city_3_code);
            }
            this.selectedCity = selectCityUse;
            console.log("cityCode", this.selectedCity);
          }
          // 删除res的skuList
          delete rs.skuList;
          // 设置关联产品
          if (rs.link1.indexOf(",") != 1) {
            this.linkProducts = rs.link1.split(",");
          }

          // 设置富文本
          // this.setTin(rs.content)
        });
    },

    getKindList() {
      kindApi.kindList().then(res => {
        this.kindList = res.data;
      });
    },
    getBrandList() {
      brandApi.brandList().then(res => {
        this.brandList = res.data.list;
        console.log(res);
      });
    },
    getSeriesList() {
      seriesApi.seriesList().then(res => {
        this.seriesList = res.data;
        console.log("seriesList", res);
      });
    },
    getProductList() {
      productApi.productList().then(res => {
        var list = res.data.list;
        list.forEach(item => {
          this.productList.push({
            key: item.id,

            label: item.gname
          });
        });
      });
    },

    // 封面图片上传成功回调
    coverSuccess(response, file, fileList) {
      this.form.cover_img = response.ossUrl;
    },
    // 轮播图片上传
    detailImgsSuccess(response, file, fileList) {
      this.form.imgs.push(response.ossUrl);
    },
    // 轮播图上传限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 4 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 下一页
    preStep() {
      this.step--;
    },
    nextStep() {
      this.step++;
    },

    // 创建
    addColorObj() {
      var colorObjNew = _.clone(this.colorObj);
      this.colorObjList.push(colorObjNew);
      this.colorObj = {};
    },
    delColor(text) {
      this.colorObjList = this.colorObjList.filter(item => item.text != text);
    },
    createSkus() {
      this.skuList = [];
      this.colorObjList.forEach(item => {
        this.skuList.push({
          tempId: item.text,
          sku_dode: "",
          color_text: item.text,
          color: item.value,
          price: 0,
          count: 0
        });
      });
    },
    // s删除颜色
    removeSku(tempId){
        this.skuList = this.skuList.filter(item => item.tempId != tempId)
    },
    // 上传图片
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    }
    // 计数框
    //  handleChange(value) {
    //     console.log(value);
    //   }
  },

  components: {}
};
</script>

<style scoped lang="scss">
.detail-main {
  .el-steps {
    margin: 0 auto;
    width: 800px;
  }
  .search-box {
    margin: 50px;

    .el-col {
      // width: 1000px;
      margin: 15px auto;
      margin-left: 40px;
    }
    .el-input {
      width: 200px;
      //  display: flex;
    }
  }
  .corer-img {
    width: 100px;
    height: 100px;
    image {
      width: 100px;
      height: 100px;
    }
  }
  .footer-btns {
    //   margin: o auto;
    text-align: center;
  }
  .detail-img {
    width: 100px;
    height: 100px;
    margin-left: 20px;
  }
}
</style>
