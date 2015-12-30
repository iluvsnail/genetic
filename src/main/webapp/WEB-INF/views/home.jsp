<%@page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page session="false" %>
<html>
<head>
	<title>Home</title>
	<script type="text/javascript" src="${pageContext.request.contextPath}/resources/js/raphael-min.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/resources/js/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/resources/js/genetic.js"></script>
	<link type="text/css" rel="stylesheet"  href="${pageContext.request.contextPath}/resources/css/genetic.css"/>
</head>
<body>
<div id="container">

</div>
<script type="text/javascript">
	$(function(){
		//children,parents,spouse
		var paper = Raphael("container",1300,600);
		GENETIC.paper = paper;
        var male=new GENETIC.male(250, 80,"爷爷","张超");
        var male2=new GENETIC.female(250, 50,"奶奶","陈芸");
        var male3=new GENETIC.male(180, 200,"爸爸","张任");
        var male4=new GENETIC.female(280, 170,"妈妈","徐飞云");
        var male5=new GENETIC.female(0, 0,"姑姑","张雪");
        var male6=new GENETIC.male(0, 0,"叔叔","张山");
        var male7=new GENETIC.female(600, 300,"我","张明");
        var male8=new GENETIC.male(250, 80,"外公","徐莽");
        var male9=new GENETIC.female(250, 50,"外婆","李琼");
        var male10=new GENETIC.male(250, 80,"舅舅","徐飞虎");
        var male11=new GENETIC.female(250, 80,"阿姨","徐飞菲");
        var male12=new GENETIC.female(250, 80,"阿姨","徐飞琳");
        var male13=new GENETIC.female(0, 0,"妻子","刘爽");
        var male14=new GENETIC.male(0, 0,"儿子","张小盒");
        var male15=new GENETIC.female(0, 0,"儿媳妇","林雪霞");
        var male16=new GENETIC.male(0, 0,"孙子","张林");
       male.children.push(male5);
       male.children.push(male6);
       male.children.push(male3);
        male.spouse.push(male2);
        male2.children.push(male3);
        male2.children.push(male5);
        male2.spouse.push(male);
        
        male3.spouse.push(male4);
        male3.parents.push(male);
        male3.parents.push(male2);
        male3.children.push(male7);
        
        male4.spouse.push(male3);
        
        male8.spouse.push(male9);
        male8.children.push(male4);
        male8.children.push(male10);
        male8.children.push(male11);
        male8.children.push(male12);
        
        //male7.spouse.push(male13);
       // male7.children.push(male14);
        male14.spouse.push(male15);
        male14.children.push(male16);
        male4.parents.push(male8);
        //GENETIC.tool.drawMale(male);
        //GENETIC.tool.drawParent(male4);
        male7.draw();
	});
</script>
</body>
</html>
