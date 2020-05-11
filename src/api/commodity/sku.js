import request from "@/api/request"
import hostSetting from "@/api/config"

function skuList(data) {
    return request({
        url: hostSetting.host + "/api/leju/admin/productSku/skuList",
        method: "get",
        data
    })
}

function saveOrUpdate(data) {
    return request({
        url: hostSetting.host + "/api/leju/admin/productSku/saveOrUpdate",
        method: "post",
        data
    })
}

function brandListAll(data) {
    // 返回了promise对象 
    return request({
        url: hostSetting.host + '/api/leju/admin/product/listAll',
        method: 'get',
        data
    })
}
export default {
    skuList,
    saveOrUpdate,
    brandListAll
}