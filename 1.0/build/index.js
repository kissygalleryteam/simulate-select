/*
combined files : 

gallery/simulate-select/1.0/index

*/
/**
 * @fileoverview 
 * @author lanmeng.bhy<lanmeng.bhy@taobao.com>
 * @module simulate-select
 * @versions 1.1
 **/
KISSY.add('gallery/simulate-select/1.0/index',function (S, Node, Base, XTemplate, O) {

    var $ = Node.all;
    var O = S.Overlay;
    var DOM = S.DOM;
    var EACH = S.each;
    var INARRAY = S.inArray; 
    var WIN = $(window);

    var SELECT_NODE = 'select'; 
    var OPTION_NODE = 'option';
    var DISABLED_NODE = 'disabled'; 
    
    var VALUE_CUSTOM_ATTR = 'data-value';
    
    var PRE_CLASS = 'simulate-';
    var SELECTED_ClASS = PRE_CLASS + 'selected';
    var DISABLED_ClASS = SELECTED_ClASS + 'disabled';
    var OPTION_ClASS = 'J_option';
    var SIMULATE_NODE_CLASS = 'J_simulate_value';
        
    var SELECT_ONE_OPTION_EVENT = 'select';
    var CHANGE_SELECT_VALUE_EVENT = 'change';
    var AFTER_OPTIONS_CHANGE_EVENT = 'afterOptionsChange';
    var AFTER_SELECTED_VALUE_CHANGE = 'afterValueChange';

    
    var SELECT_NODE_TPL = '<div class="' + PRE_CLASS + 'select"><span class="J_simulate_value">{value}</span><em></em></div>';
	var SELECT_LIST_TPL = '<div class="' + PRE_CLASS + 'list"><ul></ul></div>';
	var OPTION_TPL = '<li data-value="{{value}}" class="{{#if selected}}' + SELECTED_ClASS + '{{/if}} ' + OPTION_ClASS + '">' + 
					       '{{#if isShowSelectBox}}<input type="{{input}}" name="{{name}}" {{#if selected}}checked=true{{/if}}/>{{/if}}{{text}}' + 
					  '</li>';
    var INPUT_TPL = '<input type="hidden" name="{name}" />';
    
    /**
     * 
     * @class Simulate-select
     * @constructor
     * @extends Base
     */
    function SimulateSelect() {
        var self = this;
        
        SimulateSelect.superclass.constructor.apply(self, arguments);
        
        self._init.apply(self, arguments);
    }
    
    
    S.extend(SimulateSelect, Base, {
      
       /*
        * 初始化模拟下拉框所需要的信息以及做异常判断
        * @method	_init
        */
       _init: function(){
          var self = this; 
          var selectNode = self.selectNode = self.get('selectNode');
          
          if(!selectNode) return;                                  //如果select是空，则返回

          self.selectParent = selectNode.parent();                 //获取selectNode 的父元素
         
          self.isNative = (selectNode.nodeName() === SELECT_NODE);  //是否是原生下拉框
          
          if(self.isNative){                                       //如果是原生下拉框options，转化成ARR数据，再获取节点信息
              self._getOriginSelectOptions();
          }
          
          if(!self.get('name')){                                   //设置name
              self.set('name', self.selectNode.attr('name'));      
          }
          
          self._initSelect();
          
          self._bindEvent(); 
          
          //self.value(1);
          
          //self._changeValue();
       },
     
       
       /*
        * 获取原生select的options，将其转化成options所需要的数组
        * @method	_getOriginSelectOptions
        */
       _getOriginSelectOptions: function(){
           var self = this;
           var selectNode = self.selectNode;
           var val = selectNode.val();
           
           self.set('value', val);
           
           //get options
           var arr = []; 
           EACH(selectNode.all('option'), function(item){
               var item = $(item);
               var iVal = item.val();
               
               arr.push({
                  text: item.text() || iVal,      //如果text没有，取value
                  value: iVal,
                  selected: iVal == val
               });
           });
           
           self.set('options', arr);
           
       },
       
       /*
        * 初始化模拟下拉框（感谢 烧鹅同学的代码）
        * @method	_initSelect
        */
       _initSelect: function(){
           
            var self = this;
            var selectNode = self.selectNode;
            
			 //如果是原生select或者指定的空div，那么创建一个模拟的下拉框
            if(self.isNative || !selectNode.children().length){
                var selectNodeClass = selectNode.attr('class');
                
				select = $(DOM.create(
					S.substitute(SELECT_NODE_TPL, {value: self.getSelectTips()})
				));

				//将selectNode替换成模拟的
				selectNode.replaceWith(select);
				selectNodeClass && select.addClass(selectNodeClass);
				
				self.selectNode = select;
			}
			
			self.selectTextNode = self.selectNode.one('.' + SIMULATE_NODE_CLASS);
			
			//设置隐藏项，记录select选择内容
			self._initHiddenInput();
			 
			//设置options
			self._initOptions();
			
			self._initSelectListLayer();
			
			//设置初始化默认选中项
			self.value(self.get('value'));
			
			//设置input中的值
			self._changeValue();
			
			//设置选中文案信息
			self.get('isShowSelectText') && self._showSelectText();
       },
       
       /*
        * 创建隐藏的input，value为下拉框选中值
        * @method	_initHiddenInput
        */
       _initHiddenInput: function(){
           var self = this;
           
           self.input = $(DOM.create(S.substitute(INPUT_TPL, {name: self.get('name')})));
           self.selectParent.append(self.input);
              
       }, 
       
       /*
        * 初始化下拉框选项内容
        * @method	_initOptions
        */
       _initOptions: function(){
           var self = this;
           var options = self.get('options');
             
           if(!options)  return;
             
           //options is Array
           if(S.isArray(options)){
               
               var optionHTML = [];
               EACH(options, function(item){
                   optionHTML.push(self._renderOneOption(item));
	           });
	           
	           if(!self.selectList){
	               self.selectListBox = $(DOM.create(SELECT_LIST_TPL));
	               self.selectList = self.selectListBox.one('ul');
	               self.selectParent.append(self.selectListBox);
	           }
	          
	           self.selectList.append(optionHTML.join(''));      
	       }
                     
           //如果options是string,说明是指定一个div为select的下拉框，故直接获取
           if(typeof options == 'string'){
               self.selectListBox =$(options);
               self.selectList = self.selectListBox.one('.' + OPTION_ClASS).parent(); 
           }
       },
       
       /*
        * 渲染单个option的html
        * @method	_renderOneOption
        */ 
       _renderOneOption: function(option){
            var self = this;
            
            option.text = option.text || option.value;
            option.name = self.get('name');
            option.selected = option.selected || false;
            option.input = self.get("multi")? 'checkbox' : 'radio';
            option.isShowSelectBox = self.get('isShowSelectBox');
            
            return new XTemplate(OPTION_TPL).render(option);
        },
                        
       /*
        * 通过overlay 初始化下拉框的弹出浮层
        * @method	_initSelectListLayer
        */ 
       _initSelectListLayer: function(){
          
           var self = this;
          
           self.popSelectLayer = new O.Popup({
               srcNode: self.selectListBox,
          	   trigger: self.selectNode,
          	   triggerType: self.get('eventType'),
          	   align: S.merge(self.get('align'), {
          		    node: self.selectNode
          	   }),
          	   effect:{
          			effect: self.get('effect'),
          			duration: self.get('duration')
          	   },
          	   elStyle: {minWidth: self.get('width') || self.selectNode.innerWidth()},
          	   height : self.get('height')
           });
          	
          	self.popSelectLayer.render();
       },
 
       /*
        * 绑定事件
        * @method	_bindEvent
        */ 
       _bindEvent: function(){
           
           var self = this;
           
           //用户选中某项以后，是否在输入框中显示选中内容
           if(self.get('isShowSelectText')){
              self.on(AFTER_SELECTED_VALUE_CHANGE, self._showSelectText, self);
           }
           if(self.get('isHideBoxBySelected')){
               self.on(AFTER_SELECTED_VALUE_CHANGE, self.hide, self);
           }
           
           self.on(AFTER_SELECTED_VALUE_CHANGE, self._changeValue, self);
           self.on(AFTER_OPTIONS_CHANGE_EVENT, self._initOptions, self);
           
           self.selectList.delegate('click', '.' + OPTION_ClASS, self._onChange, self); 
           
           self.popSelectLayer.on('show', function(){
               WIN.on('click', self._hidePopSelectLayer, self);
               self.fire('show', {trigger: self.selectNode});
           });
           
           self.popSelectLayer.on('hide', function(){
               WIN.detach('click', self._hidePopSelectLayer, self);
               self.fire('hide', {trigger: self.selectNode});
           });
          
       },
      
       /*
        * 隐藏模拟下拉框浮层
        * @method	_hidePopSelectLayer
        */ 
       _hidePopSelectLayer: function(e){
           var self = this;
           var target = e.target;
           var selectListBox = self.selectListBox;
           
           if(!(target === selectListBox[0] || selectListBox.contains(target))){
               self.hide();
           }
       },
       
       /*
        * 点击模拟下拉框中的选项触发的事件，会fire select事件；如果选中值发生改变，会fire change事件，
        * @method	_onChange
        */ 
       _onChange: function(e){
       
           var self = this;
           var node = $(e.currentTarget);
           var inputNode = node.one('input'); 
           var selectList = self.selectList;
           
           if(self.get('multi')){            //如果是多选，再次点击，取消选中
               
               node.toggleClass(SELECTED_ClASS);
                
               //多选框，如果采用label则不需要处理；
               //但是IE6下必须用for，如果为每个label加for，比较麻烦
               inputNode && inputNode.attr('checked', !node.hasClass(SELECTED_ClASS));
                    
           } else{
                
               selectList.all('input').attr('checked', false);
               selectList.all('.' + OPTION_ClASS).removeClass(SELECTED_ClASS);
               
               node.addClass(SELECTED_ClASS);
               inputNode && inputNode.attr('checked', true);
           }
           
           
           var oldVal = self.get('value');
           var newVal = self._getValue();
           var eventArguments = {
               value: self.get('value'),
               target: node,
               targetVal: node.attr('data-value')
           };
           
           if(oldVal != newVal){
              self.set('value', newVal);
              self.fire(CHANGE_SELECT_VALUE_EVENT, eventArguments);
           }
           self.fire(SELECT_ONE_OPTION_EVENT, eventArguments); 

       },
       
       /*
        * 显示当前用户所选中的option的text信息
        * @method	_showSelectText
        */ 
       _showSelectText: function(){
           var self = this;
           self.selectTextNode.html(self.text() || self.getSelectTips());
       },
       
       /*
        * 如果arguments为空，则为获取当前选中的value；如果有参数，则选中设置的value，其中value支持1，2或者'1,2'
        * @method	value
        */ 
       value: function(){
           var self = this;
           
           if(!arguments.length) return self.get('value');
           
           var valArr = self._getArguments(arguments);
           var showSelectBox = self.get('isShowSelectBox');
                       
           EACH(self.getOptions(), function(item){
               
               var node = $(item);
               var isNodeSelected = INARRAY(node.attr(VALUE_CUSTOM_ATTR), valArr);
               
               if(isNodeSelected){
                   node.addClass(SELECTED_ClASS);
               } else {
                   node.removeClass(SELECTED_ClASS);
               }
               
               if(showSelectBox){
                  node.one('input').attr('checked', isNodeSelected);
               }
           });
           
           self.set('value', valArr.join(','));
           
       },
      
       /*
        * 获取当前选中的值
        * @method	_getValue
        */ 
       _getValue: function(){
            var self = this;
            var selectVal = [];
            
            EACH(self.getOptions(), function(item){
            
                var node = $(item);
                if(node.hasClass(SELECTED_ClASS)){               
                    selectVal.push(node.attr('data-value')); 
                }
                
            });
            
            return selectVal.join(",");
            
       },
       
       /*
        * 修改input的value值
        * @method	_changeValue
        */ 
       _changeValue: function(){
            var self = this;
            self.input.val(self.get('value'));
       },
       
       /*
        * 获取所选项的text
        * @method	text
        */ 
       text: function(){
           var self = this;
           var selectText = [];
           
           EACH(self.getOptions(), function(item){
           
               var node = $(item);
               if(node.hasClass(SELECTED_ClASS)){               
                   selectText.push(node.text()); 
               }
               
           });
           
           return selectText.join(",");
       },
       
       /**
   	   * 获取下拉框的提示信息
       * @method	getSelectTips
   	   */
       getSelectTips: function(){
           return this.get('selectTips');
       },
       
       /*
        * 将参数转化成数组，接收1，2，3或者'1,2,3'这样的参数，转化成[1,2,3]这样的数组
        * @method	_getArguments
        */ 
       _getArguments: function(arg){
           var arr = [];
           
           if(arg.length == 1){
              arr = arg[0].toString().split(',');
           } else {
              arr = Array.prototype.slice.call(arg, 0);
           }
           
           EACH(arr, function(item, i){
               arr[i] += '';
           });
           
           return arr;
       },
       
       /*
        * 通过设置下拉框的index选中option
        * @method	setSelectedOpitonsIndex
        */ 
       setSelectedOpitonsIndex: function(){
           var self = this;
           var indexArr = self._getArguments(arguments);
           var selectedVal = [];
           
           EACH(self.getOptions(), function(item, i){
               if(INARRAY(i.toString(), indexArr)){
                   selectedVal.push($(item).attr(VALUE_CUSTOM_ATTR));
               }
           });
           
           self.value(selectedVal.join(','));
       },
       
       /*
        * 获取当前选中的option的index
        * @method	getSelectedOptionsIndex
        */ 
       getSelectedOptionsIndex: function(){
           var self = this;
           var index = [];
           
           EACH(self.getOptions(), function(item, i){
               if($(item).hasClass(SELECTED_ClASS)){
                   index.push(i);
               }
           });   
           
           return index.join(','); 
       },
       
       /*
        * 获取所有的option
        * @method	getOptions
        */ 
       getOptions: function(index){
           var self = this;
           var indexArr = self._getArguments(arguments);
           var options = self.selectList.all('.' + OPTION_ClASS);
           
           if(!indexArr.length){
               return options;
           }
           
           var arr = [];
           
           EACH(options, function(item, i){
               if(INARRAY(i.toString(), indexArr)){
                   arr.push(item);
               }
           });
           
           return arr;
       },
       
       /*
        * 添加单个或者多个option，支持html片段、arr数组、kissy node
        * @method	addOptions
        */ 
       addOptions: function(options){
           var self = this;
           var isString = S.isString;
           var isObject = S.isObject;

           
           if(S.isArray(options)){
               var arr = [];
               
               EACH(options, function(item){
                   if(isString(item)){
                       arr.push(item);
                   }
                   if(isObject(item)){
                       arr.push(self._renderOneOption(item));
                   }
               });
               
               options = arr.join('');
           }
           
           self.selectList.append(options);
       },
       
       /*
        * 通过索引，删除对应的option
        * @method	removeOneOptionByIndex
        */ 
       removeOneOptionByIndex: function(index){
           
           var self = this;
           var options = self.getOptions();
           options.item(index).remove();
       },
       
       /*
        * 修改options
        * @method	changeOptions
        */ 
       changeOptions: function(options){
       
          var self = this;    
          if(!options) self.clearOptions();
           
          self.set('options', options);
          self._initOptions();
       },
       
       /*
        * 将options清空
        * @method	clearOptions
        */ 
       clearOptions: function(){
           var self = this;
           this.selectList.html(''); 
       },
       
       /*
        * 显示模拟下拉框
        * @method	show
        */ 
       show: function(){
           var self = this;
           self.popSelectLayer.show();
 
       },
       
       /*
        * 关闭模拟下拉框
        * @method	hide
        */ 
       hide: function(){
           var self = this;
           self.popSelectLayer.hide();
       }


    }, {ATTRS : /** @lends Simulate-select*/{
         
         /**
          * 触发下拉框的节点（如果是select或者空DOM节点，则会创建默认select样式的内容框；如果是非空DOM则会以此为select的触发节点）
          * @attribute selectNode
          * @type String，KISSY Node
          * @default null
          **/
         selectNode: {
             value: null,
             getter: function (o) {
                 if(typeof o == 'string'){
                     return	$(o);
                 }
                 return o;
             }
         },
         

         /**
          * 下拉框选项, 如果是Node List, 以Node List为option，Box为其父元素
          * @attribute options
          * @type Object  Array: [{text: xxx, value: xxxx, disabled: true}, {text: xxx, value: xxxx}]或者[{text: xxx}, {text: xxx}]
                          KISSY Node: select Node
          * @default null
          **/
         options: {
             value: null
         },
         
           
         
         /**
          * 默认显示值，如果默认值与option中某一项value相同时，则设置此选项为selected状态
          * @attribute defaultValue
          * @type String
          * @default ''
          **/
         selectTips: {
             value: '请选择'
         },
         
         
         value: {
             value: '',
             getter: function(o){
                return o.toString();
             }
         },
         
         
         isShowSelectText: {
              value: true
         },
         
         
         name: {
             value: ''
         
         },
         
         
         /**
          * 是否为多选
          * @attribute Multi
          * @type Boolean
          * @default false
          **/
         multi: {
             value: false
         },
         
         
         /**
          * 是否显示选择框，例如：单选显示radio button，复线显示checkbox
          * @attribute isShowSelectBox
          * @type Boolean
          * @default true
          **/
         isShowSelectBox: {
             value: true
         },
         
         
         /**
          * 触发显示list的事件
          * @attribute eventType
          * @type String
          * @default click
          **/
         eventType:{
             value: 'click'
         },
         
         /**
          * 宽度，超过设定宽度则又滚动条，不设置则自适应
          * @attribute width
          * @type int
          * @default null
          **/
         width: {
             value: null
         },
         
         /**
          * 高度，超过设定高度则又滚动条，不设置则自适应
          * @attribute height
          * @type int
          * @default null
          **/
         height: {
             value: null
         },
         
         
         /**
          * 对齐，按照select居左局顶对齐，还是居右对齐
          * @attribute align
          * @type String
          * @default tl
          **/
         align:{
             value:  {
                 points  : ['bl', 'tl'],
                 offset  : [0, -1],
                 overflow: {
                     adjustX: 0, // 当对象不能处于可显示区域时，自动调整横坐标
                     adjustY: 0// 当对象不能处于可显示区域时，自动调整纵坐标
                 }
             }       
         },
         
         
         
         /**
          * 弹出的list添加外层class
          * @attribute selectBoxClass
          * @type String
          * @default ''
          **/
         selectBoxClass: {
             value: ''
         },
         
         
         /**
          * 模拟下拉框样式class前缀, 如果添加前缀，已有模拟下拉框样式无法生效
          * @attribute preClass
          * @type String
          **/
          preClass: {
             value: PRE_CLASS
          },
         
         
         /**
          * 当用户选择某一项以后是否关闭选择框
          * @attribute isHideBoxBySelected
          * @type Boolean
          * @default false
          **/
         isHideBoxBySelected: {
             value: false
         },
         
         /**
          * 动画方式,  “easeNone”,”easeIn”,”easeOut”,”easeBoth”,”easeInStrong”, “easeOutStrong”,”easeBothStrong”,”elasticIn”,”elasticOut”, “elasticBoth”,”backIn”,”backOut”,”backBoth”, “bounceIn”,”bounceOut”,”bounceBoth”.
          * @attribute effect
          * @type String
          * @default ''
          **/
         effect: {
             value: ''
         },
         
         duration: {
            value: ''
         }
         
         
         
    }});
    return SimulateSelect;
}, {requires:['node', 'base', 'xtemplate', 'overlay', './index.css']});





