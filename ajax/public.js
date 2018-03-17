function $(selector){
//	selector 传入的选择器 为了避免选择器前面和后面有空格 直接把空格删除
	selector = selector.replace(/^\s+/,"");
	selector = selector.replace(/\s+$/,"");
	
//	sReg是匹配空格的正则表达式
	var sReg = /\s+/g;
	if(sReg.test(selector)){
//		把传入的selector后代选择区 用空格split成数组
		var selectors = selector.split(sReg);
//		obj是用来存储被选中的元素的 初始值为document
		var obj = document;//[div#box]
//		循环被分割后的selector数组
		for(var i=0;i<selectors.length;i++){
			//取出所有数组元素中的第一个字符 判断选择器的类型
			var firstStr = selectors[i].charAt(0);
			if(firstStr==="#"){
//				删除id选择器的#
				var selector = selectors[i].substring(1);
//				如果第一个选择器是ID选择器
				if(obj===document){
//					将通过id选择器选择的元素放入数组内 赋值给obj
					obj = oGet.getId(selector,obj);
				}else{
					var idObj = [];
					for(var j=0;j<obj.length;j++){
						var eles = oGet.getId(selector,obj[j]);
						for(var k=0;k<eles.length;k++){
							idObj.push(eles[k]);
						}
					}
					obj = idObj;
				}
			}else if(firstStr==="."){
				var selector = selectors[i].substring(1);	
				if(obj===document){
					obj = oGet.getClass(selector,obj);
				}else{	
					var classObj = [];
					for(var j=0;j<obj.length;j++){
						var eles = oGet.getClass(selector,obj[j]);;
						for(var k=0;k<eles.length;k++){
							classObj.push(eles[k]);
						}
					}
					obj = classObj;
				}
			}else{
				var selector = selectors[i];
				if(obj===document){
					obj = obj.getElementsByTagName(selector);
				}else{
					var tagObj = [];
					for(var j=0;j<obj.length;j++){
						var eles = obj[j].getElementsByTagName(selector);
						for(var k=0;k<eles.length;k++){
							tagObj.push(eles[k]);
						}
					}
					obj = tagObj;
				}
			}
		}
		return dereplication(obj);
	}else{
		var firstStr = selector.charAt(0);
		if(firstStr==="#"){
			var selector = selector.substring(1);
			return document.getElementById(selector);
		}else if(firstStr==="."){
			var selector = selector.substring(1);
			return document.getElementsByClassName(selector);
		}else{
			return document.getElementsByTagName(selector);
		}
	}
}
//去重
function dereplication(arr){
	var result = [],isRepeat;
	result.push(arr[0]);
	for(var i=1;i<arr.length;i++){
		isRepeat = false;
		for(var j=0;j<result.length;j++){
			if(arr[i]===result[j]){
				isRepeat = true;
				break;
			}
		}
		if(!isRepeat){
			result.push(arr[i]);
		}
	}
	return result;
}

var oGet = {
	getClass:function(cName,papa){
		var reg = /\s+/g;
		var result = [];
		var papa = papa||document;
		var allEle = papa.getElementsByTagName("*");
		for(var i=0;i<allEle.length;i++){
			var cNameArr = allEle[i].className.split(reg);
			for(var j=0;j<cNameArr.length;j++){
				if(cNameArr[j]==cName){
					result.push(allEle[i]);
				}
			}
		}
		return result;
	},
	getId:function(idName,papa){
		var reg = /\s+/g;
		var result = [];
		var papa = papa||document;
		var allEle = papa.getElementsByTagName("*");
		for(var i=0;i<allEle.length;i++){
			if(allEle[i].id==idName){
				result.push(allEle[i])
			}
		}
		return result;
	},
	getStyle:function(obj,attr){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj)[attr];
		}
	}
}

var move = {
//	同时长单属性运动函数
	moveSameTime:function(obj,attr,end,allTime,fn){
//		参数分别为 运动对象,改变的属性,属性结束状态,运动总时长,可选传的回调函数
		var stepNum = Math.ceil(allTime/(1000/60));
//		通过 运动总步数=运动总时长/每次运动间隔 

//		判断传入的属性是否是opacity属性
		if(attr!="opacity"){
//			不是的话   直接获取当前的attr属性值 作为运动的起始点
			var init = parseInt(oGet.getStyle(obj,attr));
		}else{
//			如果为opacity的话 取当前的attr属性值 然后放大100倍  做为运动起始点
			var init = parseInt(oGet.getStyle(obj,attr)*100);
//			重点同样放大100倍
			var end = end*100;
		}
//		计算 步长 = (终点-起点)/步数
		var step = (end - init)/stepNum;
//		定义初始的计时器初始的运动函数调用次数为0
		var count = 0;
//		为了避免出现多个计时器  在添加计时器之前 清除计时器
		clearInterval(obj.time);
		obj.time = setInterval(function(){
//			计时器每次调用都 让起始点自增一个step(起始点不断趋近于终点)
			init += step;
//			计数开始
			count++;
//			当计时器内调用函数的次数等于运动总步数的时候 判定为运动完成
			if(count==stepNum){
//				消除计算误差
				init = end;
//				清除计时器 停止运动
				clearInterval(obj.time);
//				当判断传入了fn回调函数的时候  执行该回调函数 否则 跳过
				if(fn){
					fn();
				}
			}
			if(attr!="opacity"){
//				当attr不为opacity的时候 直接将init赋值给obj的样式
				obj.style[attr] = init + "px";
			}else{
//				当attr为opacity的时候 将init缩小100倍 再赋值给obj的样式
				obj.style[attr] = init/100;	
			}
		},1000/60)
	},
//	多属性同时间运动函数
	moreAttrSameTime:function(obj,info,allTime,fn){
//		参数为 运动的元素,包含有终点信息和属性名的json数据,运动总时长,可选传的回调函数
//		存储运动信息的数组
		var result = [];
//		计算运动总步数
		var stepNum = Math.ceil(allTime/(1000/60));
//		遍历传入的json数据 循环处理运动的结束位置.初始位置.属性名.步长
		for(var key in info){
//			循环获取属性名
			var attr = key;
//			循环获取起点和终点
			if(attr!="opacity"){
				var init = parseInt(oGet.getStyle(obj,attr));
				var end = parseInt(info[key]);
			}else{
				var init = parseInt(oGet.getStyle(obj,attr)*100);
				var end = parseInt(info[key]*100);
			}
//			循环计算每个属性的步长
			var step = (end - init)/stepNum;
//			把 结束位置.初始位置.属性名.步长 都作为json的属性和属性值
			var json = {
				"attr":attr,
				"init":init,
				"end":end,
				"step":step,
			}
//			每次循环都把当前获取的json数据推入到result数组当中
			result.push(json);
		}
//		定义初始的计时器函数调用次数为0
		var count = 0;
//		避免调用多个计时器
		clearInterval(obj.time);
//		调用计时器 一次性处理多个属性值
		obj.time = setInterval(function(){
//			循环遍历取出多个属性的信息
			for(var i=0;i<result.length;i++){
//				将当前循环到的属性值起点自增一个属性值步长
				result[i].init += result[i].step;
			}
//			计数开始
			count++;
//			当判断 计时器调用函数的次数和运动总步数相等的时候 判断为运动结束
			if(count==stepNum){
//				清除运动计时器
				clearInterval(obj.time);
				for(var i=0;i<result.length;i++){
//					循环去除每个属性值的误差
					result[i].init = result[i].end;
				}
			}
//			循环将当前属性的init值 赋给obj元素的对应样式属性
			for(var i=0;i<result.length;i++){
				if(result[i].attr!="opacity"){
					obj.style[result[i].attr]=result[i].init+"px";
				}else{
					obj.style[result[i].attr]=result[i].init/100;
				}
			}
		},1000/60)
	},
	moveBuffer:function(obj,end,attr,allTime,fn){
		var stepNum = Math.ceil(allTime/(1000/60));
		var initRad = 0;
		var stepRad = (Math.PI/2)/stepNum;
		if(attr!="opacity"){
			var init = parseInt(oGet.getStyle(obj,attr));
			var distance = end - init;
		}else{
			var init = parseInt(oGet.getStyle(obj,attr)*100);
			var distance = end*100 - init;
		}
		var count = 0;
		clearInterval(obj.time);
		obj.time = setInterval(function(){
			initRad += stepRad;//0-Math.PI/2
			count ++;
			if(count==stepNum){
				initRad = Math.PI/2;
				clearInterval(obj.time);
				if(fn){
					fn();
				}
			}
			if(attr!="opacity"){
				obj.style[attr] = init + distance*Math.sin(initRad) + "px";
			}else{
				obj.style[attr] = (init + distance*Math.sin(initRad))/100;
			}		
		},1000/60);
	},
	moreAttrMoveBuffer:function(obj,info,allTime,fn){
		var initRad = 0;
		var count = 0;
		var endRad = Math.PI/2;
		var stepNum = Math.ceil(allTime/(1000/60));
		var stepRad = (endRad-initRad)/stepNum;
		var result = [];
		for(var key in info){
			if(key!="opacity"){
				var attr = key;
				var init = parseInt(oGet.getStyle(obj,attr));
				var end = parseInt(info[key]);
			}else{
				var attr = key;
				var init = parseInt(oGet.getStyle(obj,attr)*100);
				var end = parseInt(info[key]*100);
			}
			var json = {
				"attr":attr,
				"init":init,
				"end":end
			}
			result.push(json);
		}
		clearInterval(obj.time);
		obj.time = setInterval(function(){
			initRad += stepRad;
			count++;
			if(count==stepNum){
				clearInterval(obj.time);
				initRad = endRad;
				if(fn){
					fn();
				}
			}
			for(var i=0;i<result.length;i++){
				if(result[i].attr!="opacity"){
					obj.style[result[i].attr] = result[i].init+(result[i].end-result[i].init)*Math.sin(initRad) + "px"; 
				}else{
					obj.style[result[i].attr] = (result[i].init+(result[i].end-result[i].init)*Math.sin(initRad))/100;
				}
			}
		},1000/60)
	},
	moreAttrMoveAcc:function(obj,info,allTime,fn){
		var initRad = Math.PI/2;
		var count = 0;
		var endRad = Math.PI;
		var stepNum = Math.ceil(allTime/(1000/60));
		var stepRad = (endRad-initRad)/stepNum;
		var result = [];
		for(var key in info){
			if(key!="opacity"){
				var attr = key;
				var init = parseInt(oGet.getStyle(obj,attr));
				var end = parseInt(info[key]);
			}else{
				var attr = key;
				var init = parseInt(oGet.getStyle(obj,attr)*100);
				var end = parseInt(info[key]*100);
			}
			var json = {
				"attr":attr,
				"init":init,
				"end":end
			}
			result.push(json);
		}
		clearInterval(obj.time);
		obj.time = setInterval(function(){
			initRad += stepRad;
			count++;
			if(count==stepNum){
				clearInterval(obj.time);
				initRad = endRad;
			}
			for(var i=0;i<result.length;i++){
				if(result[i].attr!="opacity"){
					obj.style[result[i].attr] = result[i].init+(result[i].end-result[i].init)*(1-Math.sin(initRad)) + "px"; 
				}else{
					obj.style[result[i].attr] = (result[i].init+(result[i].end-result[i].init)*(1-Math.sin(initRad)))/100;
				}
			}
		},1000/60)
	},
	//h = 0.5*gt^2;
	parabola:function(obj,endHei,speedL,scaleSpeed,fnJson){
		var allTime = Math.sqrt(endHei*2/9.8)*1000*scaleSpeed;
		var stepNum = Math.ceil(allTime/(1000/60));
		var stepTime = allTime/stepNum;
		var initTime = 0;
		var num = 0;
		var initT = 0;
		var nowT = obj.offsetTop;
		var initL = obj.offsetLeft;
		var initSpeedL = speedL;
		console.log(initSpeedL)
		obj.time = setInterval(function(){
			console.log(1)
			num++;
			initTime += stepTime;
			initL += initSpeedL;
			initT = nowT + 0.5*9.8*Math.pow(initTime/(1000*scaleSpeed),2);
			if(num==stepNum){
				clearInterval(obj.time);
//				initT = endHei;
				if(fnJson&&fnJson.cb){
					fnJson.cb();
				}
			}
			if(fnJson&&fnJson.fn){
				fnJson.fn();
			}
			obj.style.left = initL + "px";
			obj.style.top = initT + "px";
		},1000/60)
	}
}

var oMath = {
	getRan:function(min,max){
	//	获取min-max的随机正整数
		return Math.floor(Math.random()*(max-min+1))+min;
	},
	sum:function(){
	//	参数求和
		var sum = 0;//1 3 6 10 15
		for(var i=0;i<arguments.length;i++){
			sum += arguments[i];
		}
		return sum;
	}
}


var arrCon = {
	arrAdd:function(arr,index,info){
		arr.splice(index,0,info);
	},
	arrDel:function(arr,index,num){
		arr.splice(index,num);
	},
	arrChange:function(arr,index,num,info){
		arr.splice(index,num,info);
	},
	arrSearch:function(arr,info){
		var infoArr = [];
		for(var i=0;i<arr.length;i++){
			if(arr[i]===info){
				infoArr.push(i);
			}
		}
		if(infoArr.length){
			return infoArr;
		}else{
			return "查无次值";
		}
	},
	dereplication:function(arr){
		var result = [],isRepeat;
		result.push(arr[0]);
		for(var i=1;i<arr.length;i++){
			isRepeat = false;
			for(var j=0;j<result.length;j++){
				if(arr[i]===result[j]){
					isRepeat = true;
					break;
				}
			}
			if(!isRepeat){
				result.push(arr[i]);
			}
		}
		return result;
	}
}
var domCtr = {
	getSiblings:function(obj){
		var result = [];
		var allEle = obj.parentNode.children;
		for(var i=0;i<allEle.length;i++){
			if(allEle[i]!=obj){
				result.push(allEle[i]);
			}
		}
		return result;
	}
}
function ajax(info){
	var type = info.type||"get";
	var async = info.async||true;
	var data = info.data||"";
	if(new XMLHttpRequest){
		var xhr = new XMLHttpRequest();
	}else{
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(type=="get"){
		xhr.open(type,info.url+"?"+info.data+"&t="+new Date().getTime,async);
		//xhr.open(type,'data.xml',async);
		xhr.send();
	}else{
		xhr.open(type,info.url,async);
		xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
		xhr.send(info.data);
	}
	xhr.onload = function(){
		if(info.success){
			info.success(xhr.responseText);
		}
	}
}
var oCookie = {
	add:function(info,lifeCircle){
		var oDate = new Date();
		oDate.setDate(new Date().getDate() + lifeCircle);
		for(var i=0;i<info.length;i++){
			document.cookie = info[i] + ";expires=" + oDate + ";path=/";
		}
	},
	del:function(info){
		var oDate = new Date();
		oDate.setDate(new Date().getDate() - 1);
		for(var i=0;i<info.length;i++){
			document.cookie = info[i] + "=abc;expires=" + oDate + ";path=/";
		}
	},
	get:function(info){
		var json = {};
		var reg = /\s+/g;
		var oCookie = document.cookie.replace(reg,"").split(";");
		for(var i=0;i<oCookie.length;i++){
			var keyValArr = oCookie[i].split("=");
			for(var j=0;j<info.length;j++){
				if(info[j] == keyValArr[0]){
					json[info[j]] = keyValArr[1];
				}
			}
		}
		return json;
	}
}