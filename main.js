const fs = require('fs')
let createExcel = require('./createExcel')
let arr = []
let title = ''
module.exports = {
    * beforeSendResponse(requestDetail, responseDetail) {
    // 微信公众号
        if (requestDetail.url.indexOf('https://mp.weixin.qq.com/mp/profile_ext') > -1 && requestDetail.requestOptions.method === 'GET') {
            const newResponse = responseDetail.response
            const buffer = new Buffer(newResponse.body)
            let context = buffer.toString('utf8')
            if (context.indexOf('<html') > -1 && context.indexOf('msgList') > -1) {
                title = context.match(/var\snickname(.*)/)[1].replace('=', '').replace(/\"/g, '').replace(/\|/g, '').replace(/\;/, '').trim()
                context = context.match(/msgList.*?(\{.*\})\'\;/)[1].replace(/\n*/g, '').replace(/\\\"/g, '"').replace(/\&quot\;/g, '"').replace(/\b/g, '').replace(/\\\//g, '/').replace(/^\{\"list\"\:/, '').replace(/\}$/, '')
                arr = JSON.parse(context)
            } else {
                context = context.match(/list.*?\[(.*)\]/)[1]
                if (context) {
                    context = context.replace(/\n*/g, '').replace(/\\\"/g, '"')
                    arr = arr.concat(JSON.parse(`[${context}]`))
                }
            }
            const data = `var data=${JSON.stringify({ title, list: arr })}`
            createExcel(title, arr);
            const css = '.flex1{-webkit-box-flex:1;-moz-box-flex:1;width:0;-webkit-flex:1;-ms-flex:1;flex:1}.flex-h{display:flex;-webkit-box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;-ms-flex-direction:row;-o-flex-direction:row;flex-direction:row}.flex-hw{-webkit-flex-wrap:wrap;-moz-flex-wrap:wrap;-ms-flex-wrap:wrap;-o-flex-wrap:wrap;flex-wrap:wrap}.flex-hc{-webkit-box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center}.flex-v{display:flex;-webkit-box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;-ms-flex-direction:column;-o-flex-direction:column;flex-direction:column}.flex-vw{-webkit-flex-wrap:wrap;-moz-flex-wrap:wrap;-ms-flex-wrap:wrap;-o-flex-wrap:wrap;flex-wrap:wrap}.flex-vc{-webkit-box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center}.flex-1{-webkit-box-ordinal-group:1;-moz-box-ordinal-group:1;-ms-flex-order:1;-webkit-order:1;order:1}.flex-2{-webkit-box-ordinal-group:2;-moz-box-ordinal-group:2;-ms-flex-order:2;-webkit-order:2;order:2}.flex{display:flex}.layout-box{display:flex;-webkit-box-align:center;-moz-box-align:center;-webkit-box-pack:center;-moz-box-pack:center}ul.articleList{width:800px;margin:auto}ul.articleList img{display:block}.left{float:left}.right{float:right}.img{width:260px;height:150px;overflow:hidden;border:1px solid #efefef;background:#e2e2e2}.img img{display:block}a{text-decoration:none;color:#333}.title{font-size:18px;font-weight:bold}li.flex-h{padding:20px 0;border-bottom:1px solid #e6e8eb;position:relative}.flex1{margin-left:20px}li.flex-h:hover{background:rgba(197,197,197,0.25)}.title:hover{color:#366df0}.digest{font-size:13px;color:#a0a0a0;margin-top:10px}.author{font-size:12px;color:#636363}.pr{position:relative}.author{position:absolute;bottom:0}img{max-width:none}*{box-sizing:border-box}.articleTitle{font-size:30px;text-align:center;margin:10px 0;margin-top:20px}'
            const javascript = '(function(){var index=0;var list=[];$(\'.articleTitle\').text(data.title);data.list.map(function(item){list.push({app_msg_ext_info:item.app_msg_ext_info,comm_msg_info:item.comm_msg_info});if(item.app_msg_ext_info&&item.app_msg_ext_info.multi_app_msg_item_list&&item.app_msg_ext_info.multi_app_msg_item_list.length>0){item.app_msg_ext_info.multi_app_msg_item_list.map(function(obj){list.push({app_msg_ext_info:obj,comm_msg_info:item.comm_msg_info})})}});function getImageWidth(url,callback){var img=new Image();img.src=url;if(img.complete){callback(img.width,img.height)}else{img.onload=function(){callback(img.width,img.height)}}}function AutoImgSize(img){var $container=$(img).parent();$container.addClass(\'pr\');var $img=$(img);getImageWidth($img.attr(\'src\'),function(w,h){$img._width=w;$img._height=h;var marginLeft=0;var marginTop=0;if($container.width()/$container.height()>$img._width/$img._height){$img.width($container.width());var height=$img.width()*($img._height/$img._width);$img.height(height);marginLeft=0;marginTop=(height-$container.height())/-2}else{$img.height($container.height());var width=$img.height()*($img._width/$img._height);$img.width(width);marginTop=0;marginLeft=(width-$container.width())/-2}$img.css({marginTop:marginTop,marginLeft:marginLeft})})}Date.prototype.format=function(fmt){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S":this.getMilliseconds()};if(/(y+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))}for(var k in o){if(new RegExp("("+k+")").test(fmt)){fmt=fmt.replace(RegExp.$1,RegExp.$1.length==1?o[k]:("00"+o[k]).substr((""+o[k]).length))}}return fmt};function addArticle(article,comm_msg_info){var article=list[index].app_msg_ext_info;var comm_msg_info=list[index].comm_msg_info;if(article){var li=\'\';try{li=$(\'<a target="_blank" href="\'+article.content_url.replace(/\\\\\\//g,\'/\')+\'"><li class="flex-h"><div class="img">    <img data-auto class="lazy" data-original="\'+article.cover.replace(/\\\\\\//g,\'/\')+\'"alt=""></div><div class="flex1 pr">    <div class="title">\'+article.title+\'</div>    <div class="digest">\'+article.digest+\'</div>    <div class="author" ><div style="display: inline-block;margin-right: 10px;">\'+new Date(comm_msg_info.datetime*1000).format("yyyy-MM-dd")+\'</div>\'+article.author+\'</div></div>    </li>    </a>\')}catch(e){console.log(e)}$(\'.articleList\').append(li);$(li).find(\'img\').lazyload({effect:"fadeIn",threshold:200,load:function load(e){AutoImgSize(this)}})}index++;if(list.length>index){setTimeout(function(){addArticle()})}}addArticle()})();'
            const htmlTemplate = `<!DOCTYPE html><html lang="cn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>${title}文章列表</title><link href="https://cdn.bootcss.com/minireset.css/0.0.2/minireset.min.css" rel="stylesheet"><style>${css}</style></head><body><div class="content"><div class="articleTitle"></div><ul class="articleList"></ul></div></body><script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.js"></script><script src="https://cdn.bootcss.com/jquery_lazyload/1.9.7/jquery.lazyload.min.js"></script><script>${data};${javascript}</script></html>`
            fs.writeFileSync(`./dist/${title}.html`, htmlTemplate)
        }
    }
}