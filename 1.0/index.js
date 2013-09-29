/**
 * @fileoverview 
 * @author lanmeng.bhy<lanmeng.bhy@taobao.com>
 * @module simulate-select
 **/
KISSY.add(function (S, Node, Base, XTemplate, O) {

    var $ = Node.all;
    var one = Node.one;
    var DOM = S.DOM;
    var each = S.each;
    
    
    var O = S.Overlay;

    var SELECTNODE = 'select'; 
    var OPTIONNODE = 'option';
    var DISABLEDNODE = 'disabled'; 
    
    var PRECLASS = 'simulate-';
    var SELECTEDClASS = PRECLASS + 'selected';
    var DISABLEDClASS = SELECTEDClASS + 'disabled';
    var OPTIONClASS = 'J_option';
        
    var OPTIONVALUE = 'data-value';
    var SIMULATEVAL = 'J_simulate_value';
        
    
    
    
    
    var CHANGE_VALUE_EVENT = 'changeValue'; 
    var SELECT_EVENT = 'select';
    var OPTIONS_CHANGE_EVENT = 'afterOptionsChange';
    var VALUE_CHANGE_EVENT = 'afterValueChange';
    
    
    
    
    var SELECTTPL = '<div class="' + PRECLASS + 'select"><span class="J_simulate_value">{value}</span><em></em></div>';
    var LISTTPL = '<div class="' + PRECLASS + 'list">' + 
                      '<ul>' + 
                          '{{#each list}}' +
                               '<li data-value="{{value}}" class="{{#if disabled}}' + DISABLEDClASS + '{{/if}}  {{#if selected}}' + SELECTEDClASS + '{{/if}} J_option">' + 
                                   '{{#if isShowSelectBox}}<input type="{{input}}" name="{{name}}" {{#if selected}}checked=true{{/if}}/>{{/if}}' +
                                   '{{text}}' + 
                               '</li>' + 
                          '{{/each}}' + 
                      '</ul>' + 
                  '</div>';
    
    var INPUT = '<input type="hidden" name="{name}" />';
    
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
    
    
    S.extend(SimulateSelect, Base, /** @lends SimulateSelect.prototype*/{

       _init: function(){
          var self = this; 
          var selectNode = self.selectNode = self.get('selectNode');
          
          // 如果select是空，则返回
          if(!selectNode) return; 
          
          //获取selectNode 的父元素
          self.selectParent = selectNode.parent();
          
          //存储value的隐藏域
          self.input = $(DOM.create(
          	  //如果有name获取name，如果没有取selectNode上的属性
          	  S.substitute(INPUT, {name: self.get('name') || selectNode.attr('name')})
          ));
          
          self.selectParent.append(self.input);
          
          // 是否是原生select
		  self.isNative = (selectNode.nodeName() === SELECTNODE);

		  //如果是原生节点，则需要读取节点已有信息初始化select
		  if(self.isNative){
		      self._initNativeSelect();
		  }
               
          //初始化select
          self._initSimulateSelect(); 
                    
          self._initOptions();
          
          //init overlay
          self._initBox();
          
          self._bindEvent(); 
          
          self._changeValue();
       },
      
       _initNativeSelect: function(){
           var self = this;
           var val = self.selectNode.val();
           
           self.set('name', self.selectNode.attr('name'));
           self.set('value', val);
           
           //get options
           var arr = []; 
           each(self.selectNode.all('option'), function(item){
               var item = one(item);
               arr.push({
                  text: item.text(), 
                  value: item.val() || item.text(),
                  disabled: item.attr('data-disabled'),
                  selected: item.val() == val
               });
           });
           
           self.set('options', arr);
           
       },
       
       
       //init select  -- 烧鹅
       _initSimulateSelect: function(){
           
            var self = this;
            var selectNode = self.selectNode;
            var selectNodeClass = selectNode.attr('class');
            var select;
            
			 //if select node is not select node and is not null
            if(self.isNative || !selectNode.children().length){
				select = $(DOM.create(
					S.substitute(SELECTTPL, {value: self.getSelectTips()})
				));

				//change select Node and null node to simulate select
				selectNode.replaceWith(select);
				selectNode = self.selectNode = select;
			}

			selectNodeClass && selectNode.addClass(selectNodeClass);
            self.simulateSelect = selectNode.one('.' + SIMULATEVAL);
    
       },
       
       //init select opotionBox
       _initBox: function(){
           
           var self = this;
           
           self.popup = new O.Popup({
                srcNode: self.optionBox,
           		trigger: self.selectNode,
           		triggerType: self.get('eventType'),
           		align: S.merge(self.get('align'), {
           		    node: self.selectNode
           		}),
           		effect:{
           			effect: self.get('effect'),
           			duration: self.get('duration')
           		},
           		//width : self.get('width') || self.selectNode.innerWidth(),
           		elStyle: {minWidth: self.get('width') || self.selectNode.innerWidth()},
           		height : self.get('height')
           	});
           	
           	self.popup.render();
       },
       
       _bindEvent: function(){
           
           var self = this;
           
           self.on(VALUE_CHANGE_EVENT, self._setShowSelectVal, self);
           self.on(VALUE_CHANGE_EVENT, self._changeValue, self);
           self.on(OPTIONS_CHANGE_EVENT, self._initOptions, self);
           
           self.optionBox.delegate('click', '.' + OPTIONClASS, self._selectItem, self); 
           
           self.popup.on('show', function(){
               self.fire('show', {trigger: self.selectNode});
           });
           
           self.popup.on('hide', function(){
               self.fire('hide', {trigger: self.selectNode});
           });
           
           //afterAttrNameChange()
           
       },
       
       //init select options
       _initOptions: function(){
          var self = this;
          var options = self.get('options');
          
          if(!options)  return;
          
          //options is Array
          if(S.isArray(options)){
              
              each(options, function(item){
                  item.text = item.text || item.value;
              });
             
              self._renderOption(options);
          }
                  
          //is Kissy NodeList
          if(typeof options == 'string'){
              self.optionBox = one(options); 
          }

          self._getValue();
          
       },
       
       
       _renderOption: function(options){
           var self = this;
           
           each(options, function(item){
               item.isShowSelectBox = self.get('isShowSelectBox');
               item.input = self.get("multi")? 'checkbox' : 'radio';
               item.name = self.get('name');
               item.selected = item.selected || false;
           });
           
           var optionsBox = one(DOM.create(new XTemplate(LISTTPL).render({list: options})));
           if(!self.optionBox){
               self.optionBox = optionsBox;
               self.selectParent.append(optionsBox);
           } else {
               self.optionBox.html(optionsBox.html());
           }

       },
       
       
       _selectItem: function(e){
           var self = this;
           var node = one(e.currentTarget);
           var inputNode = node.one('input');
           var val = node.attr(OPTIONVALUE);
           var orginChecked = true;
           var oldselectValue = self.get("value");
           
           if(self.get('multi')){
               
               if(node.hasClass(SELECTEDClASS)){
                   node.removeClass(SELECTEDClASS);
                   inputNode && inputNode.attr('checked', false);
                   orginChecked = false;
                   
               } else {
                   node.addClass(SELECTEDClASS);
                   inputNode && inputNode.attr('checked', true);
               }
           } else {
           
               self.optionBox.all('input').attr('checked', false);
               self.optionBox.all('.' + OPTIONClASS).removeClass(SELECTEDClASS);
               node.addClass(SELECTEDClASS);
               inputNode && inputNode.attr('checked', true);
           }
           
           if(self.get('isHideBoxBySelected')){
               self.popup.hide();
           }
           
           
           self.set('value', self._getValue());
           
           var eventJson = {
               selectVal: self.get('value'), 
               target: node, 
               checked: orginChecked, 
               value: val
           };
           
           oldselectValue != self.get('value') && self.fire(CHANGE_VALUE_EVENT, eventJson);
           self.fire(SELECT_EVENT, eventJson);
       },
       
       
       _setShowSelectVal: function(){
           var self = this;
           
           if(self.get('isShowSelectValue')){
           
               //var inner = self.get('value')? self.get('value') : self.get('selectTips');
               var inner = self.getText() || self.get('selectTips');
               self.simulateSelect.html(inner);
           }
       },
       
       
       //get all select value
       _getValue: function(){
            var self = this;
            var val = [];
            
            each(self.optionBox.all('.' + OPTIONClASS), function(item){
            
                var node = one(item);                
                if(node.hasClass(SELECTEDClASS)){               
                    val.push(node.attr('data-value')); 
                }
                
            });
            
            return val.join(",");
            
       },
       
       
       _changeValue: function(){
            var self = this;
            self.setValue(self.get('value')); 
            
            // FIXED: 隐藏域填值
            self.input.val(self.get('value'));
       },
       
       setValue: function(){

           var self = this;
           var valArr = arguments.length == 1? arguments[0].split(',') : Array.prototype.slice.call(arguments, 0);
           var options = self.optionBox.all('.' + OPTIONClASS);
           var isShowSelectBox = self.get('isShowSelectBox');
                      
           each(options, function(item){
          
               var node = one(item);
              
               if(S.inArray(node.attr(OPTIONVALUE), valArr)){
                   node.addClass(SELECTEDClASS);
                   if(isShowSelectBox){
                      node.one('input').attr('checked', true);
                   }
               } else {
                   node.removeClass(SELECTEDClASS);
                   if(isShowSelectBox){
                      node.one('input').attr('checked', false);
                   }
                  
               } 
           });
           
           self.set('value', valArr.join(','));
           
           // FIXED: 隐藏域填值
           self.input.val(self.get('value'));
       
       },
       
       
       /**
   		 * 初始化原生下拉
   		 *
   		 * @method	getSelectTips
   		 */
   		getSelectTips: function(){
   			var self = this;
   			return self.get('selectTips');
   		},
   
       
       getValue: function(){
           var self = this;
           return self.get("value");
       },
       
       setSelectedByIndex: function(){
           var self = this;
           var indexArr = arguments.length == 1? arguments[0].split(',') : Array.prototype.slice.call(arguments, 0);
           var options = self.optionBox.all('.' + OPTIONClASS);
           var valArr = [];
           
           each(options, function(item, i){
               if(S.inArray(i, indexArr)){
                   valArr.push(one(item).attr(OPTIONVALUE));
               }
           });
           
           self.setValue(valArr.join(','));
       },
     
       
       getSelectedIndex: function(){
           var self = this;
           var options = self.optionBox.all('.' + OPTIONClASS);
           var index = [];
           
           each(options, function(item, i){
               if(one(item).hasClass(SELECTEDClASS)){
                   index.push(i);
               }
           });   
           
           return index.join(',');
       },
     
       getOptionByIndex: function(index){
           
           var self = this;
           var options = self.get("options");
           
           if(typeof options == 'string'){
               return self.optionBox.all('.' + OPTIONClASS).item(index);
           }
           
           return options[index];
       },
       
       /**
        * 获取选项文本
        *
        * @method	_getText
        */
       getText: function(){
       	 var self = this;
       	 var text = [];
       	 
       	 each(self.optionBox.all('.' + OPTIONClASS), function(item){
       	 
       		 var node = one(item);                
       		 if(node.hasClass(SELECTEDClASS)){               
       			 text.push(node.text());
       			 
       		 }
       		 
       	 });
       	 
       	 return text.join(",");
       },
       
       
       changeOption: function(options){
       
          var self = this;     
          self.set('options', options);
          self._initOptions();
       },
       
       show: function(){
           var self = this;
           self.popup.show();
 
       },
       
       hide: function(){
           var self = this;
           self.popup.hide();
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
                     return	one(o);
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
         
         
         isShowSelectValue: {
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
             value: PRECLASS
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




