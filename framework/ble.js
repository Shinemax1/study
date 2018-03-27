let timeoutID;  
let log = '';  
let mDeviceID = "E6:3B:97:21:14:42:12:54";//  android  
let uuid_service = "0000fdasde6-0000-1000-8000-0080asd5f9b34fb";  
let uuid_descriptorId = "0000asd2902-0000-1000-8000-0080a5f9b34fb"; // 只有android 会用到  
let uuid_characteristicId = "0000fade8-0000-1000-8000-00805f9b3412r12fb";  
let uuid_char_write = "0000fdeasdfa7-0000-1000-8000-00805f9b34fasdfasdb";  
// let mAdvertisData = "888832454e4asdfa344asdfa44575766";  
let mAdvertisData = "8888325939514aasdfa955446945";  
let data_openDoor = "fe0fas1186501010asdf002016fb1";  
let data_openDoor2 = "b9asdfasc1b4c7e1csfaaasdfa7af41d672188f02";  
  
export function scan(callback){  
    callback.call(this,'搜索中...');  
    my.getSystemInfo({  
            success: (resSystem) => {                         
                let os = resSystem.platform;  
                if(os == 'Android'){  
               
                }else{  
                    uuid_service = "FDE6";  
                    uuid_characteristicId = "FDE8";  
                    uuid_char_write = "FDE7";  
                    mDeviceID = "ABEB31F5-5B05-4346-98E8-401FE0asdaffasd62A1F7";//  ios  
                }            
            },  
        })    
    my.openBluetoothAdapter({   
        success: function (resOpen) { // 搜索到蓝牙回调  
              // 开始扫描  
              my.stopBluetoothDevicesDiscovery();  
              my.startBluetoothDevicesDiscovery({  
                services:[uuid_service],  
  
              });  
  
              setTimeout(function(){  
                   my.stopBluetoothDevicesDiscovery();  
                      callback.call(this,'搜索完成');  
                },3000)  
  
          },   
      fail:function(resOpen){ // 请打开蓝牙  
         callback.call(this,'请打开蓝牙');  
      }  
    })   
}  
  
export function openDoor(e, callback){  
    callback.call(this , '准备校验');  
    mDeviceID = e.target.dataset.value.deviceId;  
        mAdvertisData = e.target.dataset.value.advertisData;  
        if (mAdvertisData == "888832454e434444575766"|| mAdvertisData == "888832454E434444575766"){       
            data_openDoor = "fe01186501010002016fb1";  
            data_openDoor2 = "b9c1b4c7e1c7af41d672188f02";  
        }else if(mAdvertisData == "8888325939514955446945" ){  
            data_openDoor = "fe01186501010002494059";  
            data_openDoor2 = "341a593cdafb0b04cb35fcea6a";  
        }  
  
     
    mAdvertisData = e.target.dataset.value.advertisData;  
  
  let time = 0;  
  
   // 支付宝下一个版本优化  
    // my.disconnectBLEDevice({  
    //     deviceId:mDeviceID,  
    //     success: (resState) => {  
    //     callback.call(this,'校验中'+ JSON.stringify(e));  
    //     },  
    //     fail:()=>{  
    //         callback.call(this,'校验失败,蓝牙可能累了,请断开蓝牙休息一下!');  
    //     }  
    // });  
  
  my.stopBluetoothDevicesDiscovery();// 连接之前最好停止扫描  
  my.offBLEConnectionStateChanged();  
  my.onBLEConnectionStateChanged({  
    success: (resState) => {  
      callback.call(this,'校验中.');  
      if (resState.connected){  
                my.getBLEDeviceServices({  
                    deviceId: mDeviceID,  
                    success: (resServices) => {  // 获取服务成功         
                            callback.call(this,'开门中');   
                            my.getBLEDeviceCharacteristics({  
                              deviceId: mDeviceID,  
                              serviceId: uuid_service,  
                              success: (resChar) => { // 获取特征值成功  
                                       callback.call(this,'开门中.');            
                                       my.notifyBLECharacteristicValueChange({// 第二步:设置接受到char通知  
                                        deviceId: mDeviceID,  
                                        serviceId: uuid_service,  
                                        characteristicId: uuid_characteristicId,  
                                        descriptorId: uuid_descriptorId,  
                                        success: (resValue) => { // 通知成功  
                                              callback.call(this,'开门中..');   
                                              my.onBLECharacteristicValueChange({//第三步:设置接受char数据监听  
                                                  success: (resChange) => {  
                                                    clearTimeout(timeoutID);  
                                                      my.offBLECharacteristicValueChange();// 移除低功耗蓝牙设备的特征值变化事件的监听。  
                                                      my.offBLEConnectionStateChanged();// 移除低功耗蓝牙连接的错误事件的监听。  
                                                      my.disconnectBLEDevice({  
                                                        deviceId: mDeviceID, // 蓝牙设备id  
                                                        success: (resDisConnect) => { // 断开设备成功  
                                                            callback.call(this,'开门成功');  
                                                        },  
                                                        fail: (resDisConnect) => { // 断开设备失败  
                                                            callback.call(this,'开门成功..');   
                                                            my.closeBluetoothAdapter({  
                                                                success: (res) => {  
                                                                    callback.call(this,'开门成功...');   
                                                                    },  
                                                                fail:(res) => {  
                                                                    callback.call(this,'开门成功....');   
                                                                    },  
                                                         });  
                                                        }  
                                                      });  
                                                      time=10;  
                                                    callback.call(this,'开门成功!');    
                                                  }  
                                              });  
  
                                                
                                              my.writeBLECharacteristicValue({// 第四步通信1  
                                                deviceId: mDeviceID,  
                                                serviceId: uuid_service,  
                                                characteristicId: uuid_char_write,  
                                                value: data_openDoor,  
                                                    success: (resWrite) => { // 写入成功  
                                                    callback.call(this,'开门中...');    
                                                        setTimeout(function(){ // 第二包数据,为了适配部分手机延时50ms  
                                                          my.writeBLECharacteristicValue({// 第四步通信1  
                                                            deviceId: mDeviceID,  
                                                            serviceId: uuid_service,  
                                                            characteristicId: uuid_char_write,  
                                                            value: data_openDoor2,  
                                                                success: (resWrite) => {  // 写入成功                           
                                                                },  
                                                                fail:(resWrite) => {// 写入失败1  
                                                                    time=10;  
                                                                },  
                                                          });   
                                                            },50)  
                                                    },  
                                              });   
                                      },  
                                      fail:(resValue) => {// 通知失败  
                                        callback.call(this,'开门中..');  
                                      },  
                                  });  
  
  
                                      
                              },  
                              fail:(resChar) => {// 获取特征值失败  
                                 callback.call(this,'开门中..');  
                              },  
                            });  
                                                   
                    },  
                    fail:(resServices) => {// 获取服务失败  
                        callback.call(this,'开门中');    
                    },  
                });  
           }else{// 连接中断1  
                callback.call(this,'校验中..');    
              if(time++<2){ // ios手机可能会出现连接后马上断开,尝试重连三次  
                  my.connectBLEDevice({ //第一步:连接ble,  
                      deviceId: mDeviceID  
                  })   
              }else{  
             callback.call(this,'校验中...');   
              }  
          }  
    },  
    fail: function (resState) { // 连接中断2  
        callback.call(this,'校验中....');   
        if(time++<2){ // ios手机可能会出现连接后马上断开,尝试重连三次  
            my.connectBLEDevice({ // 第一步:连接ble,  
                deviceId: mDeviceID  
            })   
        } else {  
            callback.call(this,'校验中.....');  
        }  
      }  
  });  
  
  // 第一步:连接ble,  
  my.connectBLEDevice({   
      deviceId: mDeviceID,  
  })   
      
 timeoutID = setTimeout(function(){  
        my.offBLECharacteristicValueChange();// 移除低功耗蓝牙设备的特征值变化事件的监听。  
        my.offBLEConnectionStateChanged();// 移除低功耗蓝牙连接的错误事件的监听。  
        my.disconnectBLEDevice({  
        deviceId: mDeviceID, // 蓝牙设备id  
        success: (resDisConnect) => {  
             clearTimeout(timeoutID);  
            // that.setData({   
            //     text: "连接超时" ,  
            // })  
        },  
        fail: (resDisConnect) => {  
             clearTimeout(timeoutID);  
            // that.setData({   
            //     text: "连接超时.." ,  
            // })  
        }  
        });  
    },5000)//开门时间限定5s  
}  
