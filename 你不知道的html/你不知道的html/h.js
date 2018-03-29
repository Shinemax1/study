function Print(){
    var fc = function(){
        return {
            Print:function(){
                console.log("aaaaaaaa");
            }
        };
    }
    fc.Print = function(){
        console.log("bbbbbbbb");
        return this;
    }
    return fc;
}