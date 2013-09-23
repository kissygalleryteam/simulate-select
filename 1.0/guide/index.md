## 综述

simulateSelect（模拟下拉框）: 顾名思义就是通过js实现下拉框的效果

* 版本：1.0
* 作者：lanmeng.bhy
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



### Attibute

|attribute|type|defaultValue|description|
|:---------------|:--------|:----|:----------|
|selectNode| String/kissyNode | null | 下拉框触发节点 |
|options| Array/String/kissyNode | null | 下拉选项 |
|selectTips | String | 请选择 | 选择提醒，用户未选择内容时的提醒文案 |
|value| String | '' | 当前选中的value |
|isShowSelectValue| Boolean | true | 选中某个选项以后，是展示此value |
|name| String | '' | 模拟下拉框的name, 如果是原生select，直接读取设置的name |
|multi| Boolean | false | 是否是多选 |
|isShowSelectBox| Boolean | true | 是否显示选择框，例如：单选显示radio button，复线显示checkbox |
|eventType| String | click | 触发显示下拉框的事件 |
|width| Number | null | 宽度，超过设定宽度则有滚动条，不设置则自适应 |
|height| Number | null | 高度，超过设定高度则有滚动条，不设置则自适应 |
|align| Object | { points  : ['bl', 'tl'], offset  : [0, -1], overflow: { adjustX: 0, adjustY: 0 }}  | 对齐，同Overlay的设置|
|selectBoxClass| String | '' | 下拉框外层添加的class |
|isHideBoxBySelected| Boolean | false | 当用户选择某一项以后是否关闭下拉框 |
|effect| String | '' | 动画方式,  “easeNone”,”easeIn”,”easeOut”,”easeBoth”,”easeInStrong” 等|
|duration| Number| '' | 动画shi'chan |



### Events

|event|param|description|
|:----|:----|:----------|
|show| e.trigger：下拉框节点 | 下拉框显示 |
|hide| e.trigger：下拉框节点 | 下拉框隐藏|
|changeValue|e.target: option节点； e.selectVal: 已经选中的值；e.value: 当前触发的option的value；e.checked: 当前触发option的选中状态 | 下拉框选中值发生变化 |
|select|e.target: option节点； e.selectVal: 已经选中的值；e.value: 当前触发的option的value；e.checked: 当前触发option的选中状态 | 触发任意option |

### Method

|method|param|description|
|:-----|:----|:----------|
|setValue| xx,xx | 设置下拉框选中值，单选设置一项，多选设置多项 |
|getValue| |获取下拉框选中值，返回的数据格式为xx,xx |
|setSelectedByIndex| xx,xx |设置下拉框选中的index，单选设置一项，多选设置多项|
|getSelectedIndex| |获取下拉框选中的index，返回的数据格式为xx,xx |
|getOptionByIndex| xx | 获取指定Opiton|
|changeOption| Array/String/kissyNod |修改下拉框的option|
|show||显示下拉框|
|hide||隐藏下拉框|







         
         
       




