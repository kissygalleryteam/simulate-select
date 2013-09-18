## simulateSelect（模拟下拉框）

模拟下拉框，顾名思义就是通过js实现下拉框的效果。

* 版本： 1.0
* 文档： http://gallery.kissyui.com/simulate-select/1.0/guide/index.html
* demo： http://gallery.kissyui.com/simulate-select/1.0/demo/index.html

### 为什么要模拟下拉框？
* 原生下拉框样式难看，样式无法设置
* 原生下拉框交互生硬，无法定制
* 原生下拉框在IE6下层级较高，其他浮层无法覆盖


### 支持情况
* 将原生select转化为模拟select
* 可设置指定数据下拉框、array类型数据

### 初始化
* 指定原生下拉框
    
    <select class="simulate-select" id="test3">
	    <option selected>1</option>
	    <option value='2'>2</option>
	    <option value='3'>3</option>
	    <option value='4'>4</option>
	  </select>
    <script>
      var S = KISSY;
      S.use('gallery/simulate-select/1.0/index, overlay', function (S, SimulateSelect, overlay) {
           var page = new SimulateSelect({
               selectNode: '#test3',
               isShowSelectValue: false
           });
      });
    </script>


* 指定已有的数据下拉框
* 数据源为arr


