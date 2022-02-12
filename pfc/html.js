/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function(window, $){


window.$link = function(type,action,path){
   //console.log($.pfcApp.lang_prefix,type,action,path)
   var url =  $.pfcApp.lang_prefix+(type!='page' ? (type=='component' ? '__pfcComponent/':'__pfcLayout/'):'')+path+(action!='content' ? '.'+action : '/');
   console.log(url);
   return url;
   }
/*
var $logo = function(url,attr,content){return ["a",$.extend(attr,{href:url}),content];}//var a = $('a');for(var i in attr){a.attr(i,attr[i]);} return a.append(content);}                                  
var $copy = function(content) {return ["p#copy","&copy; ",content]};

var $header = function(content) {return ["header",content]};
var $content = function(content) {return ["section.pfc-main-content",content]};
var $footer = function(content) {return ["footer",content]};


 
var $href = function(path,title,attr) {return ["a",$.extend(attr,{href:path}),title]};
 
var $li = function(content) {return ["li",content]};
var $ul = function(list,attr) {return ["ul",attr,[list]]};

var $menu = function(list,attr) {return ["ul",attr,[list]]};
var $item = function(title,path,attr){return ["li",["a",$.extend(attr,{href:path}),title]]};

var $langs = function(list){var ul=[];for(var i=0;i<list.length;i++){ul.push($li($href(list[i].short+'/',list[i].title)))};return ["ul.langs",[ul]]};

var $page = function(path,title,attr) { 
var name =  path.replace('/','_');
return ['section#'+name+'.webpage',{style:'display:none'}, [
  $header('<h1>'+title+'</h1>'),
  $content([".preload","'Loading contents...Please wait...'"])
]]}; //page

var $form = function(irl,attr,content) {return ["form",$.extend(attr,{action:irl}),content]};

var $input_row = function(title,attr) {return ["span",[["label",title],["span",["input",$.extend({type:"text",name:title.replace(' ','-')},attr)]]]]};
var $submit = function(title){return ["input",{type:"submit",value:title}]};
 
var $img = function(src,attr) {return ["img",{src:src},attr]};
*/

})(window, jQuery);
