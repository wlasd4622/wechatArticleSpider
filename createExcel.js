let xlsx = require('better-xlsx')
let fs = require('fs')
Date.prototype.format = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return fmt
}
module.exports = (title, data) => {
    const file = new xlsx.File()
    const sheet = file.addSheet('Sheet1')
    const header = sheet.addRow()
    header.setHeightCM(0.8)
    const headers = ['标题', '日期', '链接']
    for (let i = 0; i < headers.length; i++) {
        const hc = header.addCell()
        hc.value = headers[i]
        hc.style.align.v = 'center'
    }
    let list = []
    data.map(function (item) {
        try {
            list.push([item.app_msg_ext_info.title, new Date(item.comm_msg_info.datetime * 1000).format('yyyy-MM-dd'), item.app_msg_ext_info.content_url])
            if (item.app_msg_ext_info && item.app_msg_ext_info.multi_app_msg_item_list && item.app_msg_ext_info.multi_app_msg_item_list.length > 0) {
                item.app_msg_ext_info.multi_app_msg_item_list.map(function (obj) {
                    list.push([obj.title, new Date(item.comm_msg_info.datetime * 1000).format('yyyy-MM-dd'), obj.content_url])
                })
            }
        } catch (e) {
            console.log(e)
            console.log(item.app_msg_ext_info)
        }
    })
    const len = list.length
    for (let i = 0; i < len; i++) {
        const line = list[i]
        const row = sheet.addRow()
        row.setHeightCM(0.8)
        const cell1 = row.addCell()
        cell1.value = line[0]
        const cell2 = row.addCell()
        cell2.value = line[1]
        const cell3 = row.addCell()
        cell3.value = line[2]
    }
    sheet.col(0).width = 50
    sheet.col(1).width = 14
    sheet.col(2).width = 50
    file.saveAs().pipe(fs.createWriteStream(`./dist/${title}.xlsx`))
        .on('finish', () => console.log('Done.'))
}
