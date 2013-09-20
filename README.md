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
	     <div class="simulate-select" id="test2"></div>
	     <div id="J_test4" class="simulate-list">
	         <ul>
		     <li class="item J_option" data-value='1'>1</li>
		     <li class="item J_option" data-value='2'>2</li>
	         </ul>
	     </div>
	     <script>
	     var S = KISSY;
	     S.use('gallery/simulate-select/1.0/index, overlay', function (S, SimulateSelect, overlay) {
	        var page = new SimulateSelect({
	             selectNode: '#test2',
	             options: '#J_test4',
	             isShowSelectBox: false,
	             multi: true,
	             isShowSelectValue: false,
	             value: '2'
	         });
	     });
	     </script>
	    
* 数据源为arr
	    <div class="simulate-select" id="test1" >
		   <span class="J_simulate_value">出发时间</span><em></em>
	    </div>
	    <script>
	    var S = KISSY;
	    S.use('gallery/simulate-select/1.0/index, overlay', function (S, SimulateSelect, overlay) {
	        var page = new SimulateSelect({
	             selectNode: '#test1',
	             options: [{text: '1', value: '1', disabled: true}, {text: '2', value: '2', disabled: false}],
	             isShowSelectValue: false,
	             name: 'test',
	             multi: false,
	             isShowSelectBox: false
	         });
	    });
	    </script>

