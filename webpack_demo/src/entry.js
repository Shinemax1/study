import css from '../css/index.css';
import less from '../css/black.less';
import scss from '../css/white.scss';
//导入json文件
var json = require('../config/config.json');
let cxf = 'Hello Webpack1122555';
//document.getElementById('title').innerHTML=cxf;
$('#title').html('Hello cxf12223322233111');
$('#json').html(json.name);