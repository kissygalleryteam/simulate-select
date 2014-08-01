/*! simulate-select - v2.0.0 - 2013-10-05 11:48:05 PM
* Copyright (c) 2013 兰梦; Licensed  */
KISSY.add("kg/simulate-select/2.0.0/index",function(a,b,c,d,e){function f(){var a=this;f.superclass.constructor.apply(a,arguments),a._init.apply(a,arguments)}var g=b.all,e=a.Overlay,h=a.DOM,i=a.each,j=a.inArray,k=g(window),l="select",m="data-value",n="simulate-",o=n+"selected",p="J_option",q="J_simulate_value",r="select",s="change",t="afterOptionsChange",u="afterValueChange",v='<div class="'+n+'select"><span class="J_simulate_value">{value}</span><em></em></div>',w='<div class="'+n+'list"><ul></ul></div>',x='<li data-value="{{value}}" class="{{#if selected}}'+o+"{{/if}} "+p+'">'+'{{#if isShowSelectBox}}<input type="{{input}}" name="{{name}}" {{#if selected}}checked=true{{/if}}/>{{/if}}{{text}}'+"</li>",y='<input type="hidden" name="{name}" />';return a.extend(f,c,{_init:function(){var a=this,b=a.selectNode=a.get("selectNode");b&&(a.selectParent=b.parent(),a.isNative=b.nodeName()===l,a.isNative&&a._getOriginSelectOptions(),a.get("name")||a.set("name",a.selectNode.attr("name")),a._initSelect(),a._bindEvent())},_getOriginSelectOptions:function(){var a=this,b=a.selectNode,c=b.val();a.set("value",c);var d=[];i(b.all("option"),function(a){var a=g(a),b=a.val();d.push({text:a.text()||b,value:b,selected:b==c})}),a.set("options",d)},_initSelect:function(){var b=this,c=b.selectNode;if(b.isNative||!c.children().length){var d=c.attr("class");select=g(h.create(a.substitute(v,{value:b.getSelectTips()}))),c.replaceWith(select),d&&select.addClass(d),b.selectNode=select}b.selectTextNode=b.selectNode.one("."+q),b._initHiddenInput(),b._initOptions(),b._initSelectListLayer(),b.value(b.get("value")),b._changeValue(),b.get("isShowSelectText")&&b._showSelectText()},_initHiddenInput:function(){var b=this;b.input=g(h.create(a.substitute(y,{name:b.get("name")}))),b.selectParent.append(b.input)},_initOptions:function(){var b=this,c=b.get("options");if(c){if(a.isArray(c)){var d=[];i(c,function(a){d.push(b._renderOneOption(a))}),b.selectList||(b.selectListBox=g(h.create(w)),b.selectList=b.selectListBox.one("ul"),b.selectParent.append(b.selectListBox)),b.selectList.append(d.join(""))}"string"==typeof c&&(b.selectListBox=g(c),b.selectList=b.selectListBox.one("."+p).parent())}},_renderOneOption:function(a){var b=this;return a.text=a.text||a.value,a.name=b.get("name"),a.selected=a.selected||!1,a.input=b.get("multi")?"checkbox":"radio",a.isShowSelectBox=b.get("isShowSelectBox"),new d(x).render(a)},_initSelectListLayer:function(){var b=this;b.popSelectLayer=new e.Popup({srcNode:b.selectListBox,trigger:b.selectNode,triggerType:b.get("eventType"),align:a.merge(b.get("align"),{node:b.selectNode}),effect:{effect:b.get("effect"),duration:b.get("duration")},elStyle:{minWidth:b.get("width")||b.selectNode.innerWidth()},height:b.get("height")}),b.popSelectLayer.render()},_bindEvent:function(){var a=this;a.get("isShowSelectText")&&a.on(u,a._showSelectText,a),a.get("isHideBoxBySelected")&&a.on(u,a.hide,a),a.on(u,a._changeValue,a),a.on(t,a._initOptions,a),a.selectList.delegate("click","."+p,a._onChange,a),a.popSelectLayer.on("show",function(){k.on("click",a._hidePopSelectLayer,a),a.fire("show",{trigger:a.selectNode})}),a.popSelectLayer.on("hide",function(){k.detach("click",a._hidePopSelectLayer,a),a.fire("hide",{trigger:a.selectNode})})},_hidePopSelectLayer:function(a){var b=this,c=a.target,d=b.selectListBox;c===d[0]||d.contains(c)||b.hide()},_onChange:function(a){var b=this,c=g(a.currentTarget),d=c.one("input"),e=b.selectList;b.get("multi")?(c.toggleClass(o),d&&d.attr("checked",!c.hasClass(o))):(e.all("input").attr("checked",!1),e.all("."+p).removeClass(o),c.addClass(o),d&&d.attr("checked",!0));var f=b.get("value"),h=b._getValue(),i={value:b.get("value"),target:c,targetVal:c.attr("data-value")};f!=h&&(b.set("value",h),b.fire(s,i)),b.fire(r,i)},_showSelectText:function(){var a=this;a.selectTextNode.html(a.text()||a.getSelectTips())},value:function(){var a=this;if(!arguments.length)return a.get("value");var b=a._getArguments(arguments),c=a.get("isShowSelectBox");i(a.getOptions(),function(a){var d=g(a),e=j(d.attr(m),b);e?d.addClass(o):d.removeClass(o),c&&d.one("input").attr("checked",e)}),a.set("value",b.join(","))},_getValue:function(){var a=this,b=[];return i(a.getOptions(),function(a){var c=g(a);c.hasClass(o)&&b.push(c.attr("data-value"))}),b.join(",")},_changeValue:function(){var a=this;a.input.val(a.get("value"))},text:function(){var a=this,b=[];return i(a.getOptions(),function(a){var c=g(a);c.hasClass(o)&&b.push(c.text())}),b.join(",")},getSelectTips:function(){return this.get("selectTips")},_getArguments:function(a){var b=[];return b=1==a.length?a[0].toString().split(","):Array.prototype.slice.call(a,0),i(b,function(a,c){b[c]+=""}),b},setSelectedOpitonsIndex:function(){var a=this,b=a._getArguments(arguments),c=[];i(a.getOptions(),function(a,d){j(d.toString(),b)&&c.push(g(a).attr(m))}),a.value(c.join(","))},getSelectedOptionsIndex:function(){var a=this,b=[];return i(a.getOptions(),function(a,c){g(a).hasClass(o)&&b.push(c)}),b.join(",")},getOptions:function(){var a=this,b=a._getArguments(arguments),c=a.selectList.all("."+p);if(!b.length)return c;var d=[];return i(c,function(a,c){j(c.toString(),b)&&d.push(a)}),d},addOptions:function(b){var c=this,d=a.isString,e=a.isObject;if(a.isArray(b)){var f=[];i(b,function(a){d(a)&&f.push(a),e(a)&&f.push(c._renderOneOption(a))}),b=f.join("")}c.selectList.append(b)},removeOneOptionByIndex:function(a){var b=this,c=b.getOptions();c.item(a).remove()},changeOptions:function(a){var b=this;a||b.clearOptions(),b.set("options",a),b._initOptions()},clearOptions:function(){this.selectList.html("")},show:function(){var a=this;a.popSelectLayer.show()},hide:function(){var a=this;a.popSelectLayer.hide()}},{ATTRS:{selectNode:{value:null,getter:function(a){return"string"==typeof a?g(a):a}},options:{value:null},selectTips:{value:"\u8bf7\u9009\u62e9"},value:{value:"",getter:function(a){return a.toString()}},isShowSelectText:{value:!0},name:{value:""},multi:{value:!1},isShowSelectBox:{value:!0},eventType:{value:"click"},width:{value:null},height:{value:null},align:{value:{points:["bl","tl"],offset:[0,-1],overflow:{adjustX:0,adjustY:0}}},selectBoxClass:{value:""},preClass:{value:n},isHideBoxBySelected:{value:!1},effect:{value:""},duration:{value:""}}}),f},{requires:["node","base","xtemplate","overlay","./index.css"]});