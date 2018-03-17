//前端跨域的几种方式
            //1.同源测略 协议域名端口相同即为同源
            //2.浏览器不同的域名不能访问对应的cookie，但是内部表单不受限制
            //3.同源策略的限制对象（跨域）
                //（1）.cookie、indexDB、LocalStorage无法获取
                //（2）.DOM无法获得
                //（3）.AJAX不能发送
            //4.如何设置同源策略（hosts）
                //test.xxx.com a.html
                document.cookie = "test1=hello"
                document.domain = "xxx.com"//设置同源策略
            //test2.xxx.com b.html
                document.cookie
            //服务器端用  set-cookie: domain = ".xxx.com"
        //5.img script iframe link(css攻击)
        //6.websocket postMessage(iframe image)
        //代码写到image里面img--》http://www.jb51.net/article/102767.htm

//使用div进行布局 不要用div进行无意义的包裹 span是行内常见的语义