// 引入自行封装的axios
import request from '@/api/request'
import hostSetting from "@/api/config"

function productList(data) {
    // 返回了promise对象 
    return request({
        url: hostSetting.host + '/api/leju/admin/product/list',
        method: 'get',
        data
    })
}

function switchCode(data) {
    // 返回了promise对象 
    return request({
        url: hostSetting.host + '/api/leju/admin/product/switchCode',
        method: 'get',
        data
    })
}


function brandList(data) {
    // 返回了promise对象 
    return request({
        url: hostSetting.host + '/api/leju/admin/brand/list',
        method: 'get',
        data
    })
}

function detail(data) {
    return request({
        url: hostSetting.host + '/api/leju/admin/product/detail',
        method: 'get',
        data
    })
}

export default {
    productList,
    switchCode,
    brandList,
    detail

}