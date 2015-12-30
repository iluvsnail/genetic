(function($) {
	if (typeof GENETIC == 'undefined') {
		GENETIC = {};
	}
	GENETIC.person = function() {
		this.draw = function() {
			this.drewed=true;
			if(this.x+this.r+50>GENETIC.paper.width){
				GENETIC.paper.setSize(this.x+this.r+50,GENETIC.paper.height);
			}
			if(this.y+this.r+50>GENETIC.paper.height){
				GENETIC.paper.setSize(GENETIC.paper.width,this.y+this.r+50);
			}
			switch (this.gender) {
			case "male":
				var circle = GENETIC.paper.circle(this.x, this.y, this.r);
				var p=this;
				circle.click(function(){
					var div =GENETIC.tool.createMenu(this,p);
					$("body").append(div);
				});
				circle.attr({
					"fill" : "#fff",
					"stroke" : "#2f6ab6",
					"stroke-width" : 5
				});
				var start_x = this.x - this.r / 1.414;
				var start_y = this.y - this.r / 1.414;
				var end_x = this.x - (this.r + 5) * 1.8 / 1.414;
				var end_y = this.y - (this.r + 5) * 1.8 / 1.414;
				var mline=GENETIC.paper.path(
						"M" + start_x + " " + start_y + "L" + end_x + " "
								+ end_y + "M" + (end_x + 5) + " " + (end_y)
								+ "L" + (end_x) + " " + (end_y + 20) + "M"
								+ end_x + " " + (end_y + 5) + "L"
								+ (end_x + 20) + " " + (end_y)).attr({
					"stroke" : "#2f6ab6",
					"stroke-width" : 5
				});
				var mtext=GENETIC.paper.text(this.x, this.y + this.r + 10, this.relation
						+ "(" + this.name + ")");
				this.svgObjs.push(circle);
				this.svgObjs.push(mline);
				this.svgObjs.push(mtext);
				break;
			case "female":
				var circle2 = GENETIC.paper.circle(this.x, this.y, this.r);
				var p2=this;
				circle2.click(function(){
					var div =GENETIC.tool.createMenu(this,p2);
					$("body").append(div);
				});
				circle2.attr({
					"fill" : "#fff",
					"stroke" : "#e78083",
					"stroke-width" : 5
				});
				var mline2=GENETIC.paper.path(
						"M" + this.x + " " + (this.y + this.r) + "L" + this.x
								+ " " + (this.y + this.r * 3) + "M"
								+ (this.x - this.r) + " "
								+ (this.y + this.r * 2) + "L"
								+ (this.x + this.r) + " "
								+ (this.y + this.r * 2)).attr({
					"stroke" : "#e78083",
					"stroke-width" : 5
				});
				var mtext2=GENETIC.paper.text(this.x, this.y + this.r * 3 + 10,
						this.relation + "(" + this.name + ")");
				this.svgObjs.push(circle2);
				this.svgObjs.push(mline2);
				this.svgObjs.push(mtext2);
				break;
			default:
				;
			}
		}
		this.addSpouse = function(){
			if(!this.spouse || this.spouse.length>0){
				return false;
			}
			switch (this.gender) {
			case "male":
				var x=this.x+8*this.r;
				var y=this.y-this.r*2;
				var relation=GENETIC.tool.getRelation(this.relation,'wife');
				if(relation){
					var wife = new GENETIC.female(x, y,relation,"");
					//添加妻子
					this.spouse.push(wife);
					//添加丈夫
					wife.spouse.push(this);
					//复制孩子
					for(var n in this.children){
						if(n){
							wife.children.push(this.children[n]);
						}
					}
					//绘制妻子
					wife.draw();
					//绘制夫妻之间的线
					GENETIC.tool.drawSpouseLine(this,wife);
				}
				break;
			case "female":
				var x=this.x+8*this.r;
				var y=this.y+this.r*2;
				var relation=GENETIC.tool.getRelation(this.relation,'husband');
				if(relation){
					var husb = new GENETIC.male(x, y,relation,"");
					//添加丈夫
					this.spouse.push(husb);
					//添加妻子
					husb.spouse.push(this);
					//复制孩子
					for(var n in this.children){
						if(n){
							husb.children.push(this.children[n]);
						}
					}
					//绘制配偶
					husb.draw();
					//绘制夫妻之间的线
					GENETIC.tool.drawSpouseLine(husb,this);
				}
				break;
			default:
				;
			}
		}
		this.addChild = function(rel){
			if(!rel) return;
			this.clearChildren();
			switch (rel) {
			case "son":
				var x=0;
				var y=0;
				var relation=GENETIC.tool.getRelation(this.relation,'son');
				if(relation){
					var son = new GENETIC.male(x, y,relation,"");
					//添加孩子
					this.children.push(son);
					//配偶添加孩子
					if(this.spouse && this.spouse.length>0){
						this.spouse[0].children.push(son);
						son.parents.push(this.spouse[0]);
					}
					son.parents.push(this);
				}
				break;
			case "daughter":
				var x=0;
				var y=0;
				var relation=GENETIC.tool.getRelation(this.relation,'daughter');
				if(relation){
					var daughter = new GENETIC.female(x, y,relation,"");
					//添加孩子
					this.children.push(daughter);
					//配偶添加孩子
					if(this.spouse && this.spouse.length>0){
						this.spouse[0].children.push(daughter);
						daughter.parents.push(this.spouse[0]);
					}
					daughter.parents.push(this);
				}
				break;
			default:
				;
			}
			this.redrawChildren();
		}
		this.clearChildren = function(flag){
			if(this.childrenLineSVG)
				this.childrenLineSVG.remove();
			if(flag){
				if(this.spouseLineSVG){
					this.spouseLineSVG.remove();
				}
				if(this.spouse[0]){
					this.spouse[0].remove();
				}
			}
			for(var n=0;n<this.children.length;n++){
				var child = this.children[n];
				if(child.childLineSVG){
					child.childLineSVG.remove();
				}
				child.remove();
				child.clearChildren(true);
			}
		}
		this.redrawChildren = function(){
			//重新绘制孩子
			if(this.spouse[0]){
			} else if(this.children[0]){
				this.addSpouse();
			}
			var sp = this.spouse[0];
			if(sp){
				if(!sp.drewed){
					if(sp.gender == 'male'){
						sp.x = this.x + (this.r + sp.r) * 4;
						/** (1+((male.children.length>1?(male.children.length-1)*0:0))) */
						sp.y = this.y - 30;
					}else{
						sp.x = this.x + (this.r + sp.r) * 4;
						/** (1+((male.children.length>1?(male.children.length-1)*0:0))) */
						sp.y = this.y - 30;
					}
					sp.draw();
				}
				if(this.spouseLineSVG && this.spouseLineSVG[0]){
					
				}else{
					GENETIC.tool.drawSpouseLine(this, sp);
				}
				// 画孩子
				if (this.children.length > 0) {
					if(this.gender == "female"){
						GENETIC.tool.drawChildrenLine(sp,this);
					}else{
						GENETIC.tool.drawChildrenLine(this, sp);
					}
				}
				var length = (this.r + sp.r)
						* 8
						* (((this.children.length > 1 ? (this.children.length - 1)
								: 0)));
				var center_x = this.x + (sp.x - this.x) / 2;
				var center_y = this.y + 4 * this.r+this.r*2*(this.gender == "female" ? 1 : 0);
				for (var i = 0; i < this.children.length; i++) {
					var ch = this.children[i];
					if (this.children.length % 2 == 0) {
						var offset = i;
						var start_x = (center_x - length / 2) + offset
								* (this.r + sp.r) * 8;
						var start_y = center_y + 4 * this.r - 30
								* (ch.gender == "female" ? 1 : 0);
						ch.x = start_x;
						ch.y = start_y;
					} else {
						var offset = parseInt((i + 1) / 2);
						if ((i + 1) % 2 == 0) {
							offset = -offset;
							var start_x = center_x + offset * (this.r + sp.r) * 8;
							var start_y = center_y + 4 * this.r - 30
									* (ch.gender == "female" ? 1 : 0);
							ch.x = start_x;
							ch.y = start_y;
						} else {
							var start_x = center_x + offset * (this.r + sp.r) * 8;
							var start_y = center_y + 4 * this.r- 30
							* (ch.gender == "female" ? 1 : 0);
							ch.x = start_x;
							ch.y = start_y;
						}
					}
					if(this.gender == "female"){
						GENETIC.tool.drawChildLine(sp,this,ch);
					}else{
						GENETIC.tool.drawChildLine(this, sp, ch);
					}
					ch.draw();
					ch.redrawChildren();
					/*if(!ch.drewed){
						GENETIC.tool.drawMale(ch);
					}*/

				}
			}
		}
		
		this.remove = function(){
			this.drewed=false;
			for(var n =0;n<this.svgObjs.length;n++){
				this.svgObjs[n].remove();
			}
		}
		
		this.addParents = function(){
			if(this.parents.length>0) return ;
			//添加父亲
			var fx = this.x - this.r*4
			var fy = this.y - this.r*8 + this.r*2*(this.gender == 'female'?1:0);
			var frelation = GENETIC.tool.getRelation(this.relation,'father');
			var f=new GENETIC.male(fx,fy,frelation,"");
			//添加母亲
			var mx = this.x + this.r*4;
			var my = this.y -this.r*8 -this.r*2+this.r*2*(this.gender == 'female'?1:0);
			var mrelation = GENETIC.tool.getRelation(this.relation,'mother');
			var m=new GENETIC.female(mx,my,mrelation,"");
			f.spouse.push(m);
			m.spouse.push(f);
			f.children.push(this);
			m.children.push(this);
			this.parents.push(f);
			this.parents.push(m);
			f.draw();
			//m.draw();
			f.clearChildren();
			f.redrawChildren();
		}
	}

	GENETIC.male = function(x, y, relation, name) {
		this.gender = 'male';
		this.x = x;
		this.y = y;
		this.r = 15;
		this.children = new Array();
		this.parents = new Array();
		this.spouse = new Array();
		this.svgObjs = new Array();
		this.relation = relation;
		this.name = name;
	};
	GENETIC.male.prototype = new GENETIC.person();
	GENETIC.female = function(x, y, relation, name) {
		this.gender = 'female';
		this.x = x;
		this.y = y;
		this.r = 15;
		this.children = new Array();
		this.parents = new Array();
		this.spouse = new Array();
		this.svgObjs = new Array();
		this.relation = relation;
		this.name = name;
	};
	GENETIC.female.prototype = new GENETIC.person();
	GENETIC.tool = {
		drawSpouseLine : function(male, female) {
			var start_x = male.x;
			var start_y = male.y + 2 * male.r;
			var end_x = female.x;
			var end_y = female.y + 4 * female.r;
			var spouseLineSVG=GENETIC.paper.path(
					"M" + start_x + " " + start_y + "L" + start_x + " "
							+ (end_y + male.r) + "L" + (end_x) + " "
							+ (end_y + female.r) + "L" + (end_x) + " "
							+ (end_y)).attr({
				"stroke" : "black",
				"stroke-width" : 1
			});
			male.spouseLineSVG=spouseLineSVG;
			female.spouseLineSVG=spouseLineSVG;
		},
		drawChildrenLine : function(male, female) {
			var start_x = male.x + (female.x - male.x) / 2;
			var start_y = male.y + male.r * 3;
			var cLSVG=GENETIC.paper.path(
					"M" + start_x + " " + start_y + "L" + start_x + " "
							+ (start_y + male.r)).attr({
				"stroke" : "black",
				"stroke-width" : 1
			});
			male.childrenLineSVG=cLSVG;
			female.childrenLineSVG=cLSVG;

		},
		drawChildLine : function(male, female, ch) {
			var start_x = ch.x;
			var start_y = ch.y - male.r * (ch.gender == "male" ? 3 : 1);
			var end_x = male.x + (female.x - male.x) / 2;
			var end_y = male.y + male.r * 4;
			var CLSVG=GENETIC.paper.path(
					"M" + start_x + " " + start_y + "L" + start_x + " "
							+ (start_y - male.r) + "L" + end_x + " " + (end_y))
					.attr({
						"stroke" : "black",
						"stroke-width" : 1
					});
			ch.childLineSVG=CLSVG;
		},
		drawMale : function(male) {
			// 画自己
			male.draw();
			// 画媳妇
			var sp = male.spouse[0];
			if(sp){
				sp.x = male.x + (male.r + sp.r) * 4;
				/** (1+((male.children.length>1?(male.children.length-1)*0:0))) */
				sp.y = male.y - 30;
				sp.draw();
				GENETIC.tool.drawSpouseLine(male, sp);
				// 画孩子
				if (male.children.length > 0) {
					GENETIC.tool.drawChildrenLine(male, sp);
				}
				var length = (male.r + sp.r)
						* 8
						* (((male.children.length > 1 ? (male.children.length - 1)
								: 0)));
				var center_x = male.x + (sp.x - male.x) / 2;
				var center_y = male.y + 4 * male.r;
				for (var i = 0; i < male.children.length; i++) {
					var ch = male.children[i];
					if (male.children.length % 2 == 0) {
						var offset = i;
						var start_x = (center_x - length / 2) + offset
								* (male.r + sp.r) * 8;
						var start_y = center_y + 4 * male.r - 30
								* (ch.gender == "female" ? 1 : 0);
						ch.x = start_x;
						ch.y = start_y;
					} else {
						var offset = parseInt((i + 1) / 2);
						if ((i + 1) % 2 == 0) {
							offset = -offset;
							var start_x = center_x + offset * (male.r + sp.r) * 8;
							var start_y = center_y + 4 * male.r - 30
									* (ch.gender == "female" ? 1 : 0);
							ch.x = start_x;
							ch.y = start_y;
						} else {
							var start_x = center_x + offset * (male.r + sp.r) * 8;
							var start_y = center_y + 4 * male.r- 30
							* (ch.gender == "female" ? 1 : 0);
							ch.x = start_x;
							ch.y = start_y;
						}
					}
					GENETIC.tool.drawChildLine(male, sp, ch);
					if(!ch.drewed){
						GENETIC.tool.drawMale(ch);
					}

				}
			}
		},
		drawParent : function(female) {
			var parents = female.parents;
			for (var i = 0; i < parents.length; i++) {
				var parent = parents[i];
				if (parent.gender == "male") {
					var length = (female.r + female.r)
							* 8
							* (((parent.children.length > 1 ? (parent.children.length - 1)
									: 0)));
					var p_x = female.x + length / 2 - female.r * 4;
					var p_y = female.y + 30 - female.r * 8;
					parent.x = p_x;
					parent.y = p_y;
					GENETIC.tool.drawMale(parent);
				}
			}
		},
		createMenu:function(svg,p){
			$(".menu").remove();
			var x =svg.attr("cx");
			var y =svg.attr("cy");
			var div =$("<div />").css({
				"left":x,
				"top" :y
			}).addClass("menu");
			var li=GENETIC.tool.createItem("添加父母",function(){
				$("div.menu").has(this).hide();
				p.addParents();
			});
			var li3=GENETIC.tool.createItem("添加儿子",function(){
				$("div.menu").has(this).hide();
				p.addChild("son");
			});
			var li4=GENETIC.tool.createItem("添加女儿",function(){
				$("div.menu").has(this).hide();
				p.addChild("daughter");
			});
			var li5=GENETIC.tool.createItem("添加配偶",function(){
				$("div.menu").has(this).hide();
				p.addSpouse();
			});
			var li6=GENETIC.tool.createItem("删除",function(){
				$("div.menu").has(this).hide();
				alert("删除");
			});
			var li7=GENETIC.tool.createItem("修改信息",function(){
				$("div.menu").has(this).hide();
				alert("信息");
			});

			$(div).append(li7);
			$(div).append(li);
			$(div).append(li5);
			$(div).append(li3);
			$(div).append(li4);
			$(div).append(li6);
			return div;
		},
		createItem : function(text,fn){
			return $("<li />").addClass("menuItem").text(text).click(fn);
		},
		getRelation : function(r1,r2){
			var r3 = "";
			switch(r1){
			case "我":
				switch(r2){
				case "father":
					r3="父亲";
					break;
				case "mother":
					r3="母亲";
					break;
				case "wife":
					r3="妻子";
					break;
				case "husband":
					r3="丈夫";
					break;
				case "son":
					r3="儿子";
					break;
				case "daughter":
					r3="女儿";
					break;
				default:;
				}
				break;
			case "妻子":
				switch(r2){
				case "father":
					r3="岳父";
					break;
				case "mother":
					r3="岳母";
					break;
				case "wife":
					r3="妻子";
					break;
				case "husband":
					r3="丈夫";
					break;
				case "son":
					r3="儿子";
					break;
				case "daughter":
					r3="女儿";
					break;
				default:;
				}
				break;
			case "父亲":
				switch(r2){
				case "father":
					r3="爷爷";
					break;
				case "mother":
					r3="奶奶";
					break;
				case "wife":
					r3="母亲";
					break;
				case "husband":
					r3="父亲";
					break;
				case "son":
					r3="哥哥/弟弟";
					break;
				case "daughter":
					r3="姐姐/妹妹";
					break;
				default:;
				}
				break;
			case "母亲":
				switch(r2){
				case "father":
					r3="外公";
					break;
				case "mother":
					r3="外婆";
					break;
				case "wife":
					r3="母亲";
					break;
				case "husband":
					r3="父亲";
					break;
				case "son":
					r3="哥哥/弟弟";
					break;
				case "daughter":
					r3="姐姐/妹妹";
					break;
				default:;
				}
				break;
			case "爷爷":
			case "奶奶":
				switch(r2){
				case "father":
					r3="";
					break;
				case "mother":
					r3="";
					break;
				case "wife":
					r3="奶奶";
					break;
				case "husband":
					r3="爷爷";
					break;
				case "son":
					r3="伯伯/叔叔";
					break;
				case "daughter":
					r3="姑姑";
					break;
				default:;
				}
				break;
			case "外公":
			case "外婆":
				switch(r2){
				case "father":
					r3="";
					break;
				case "mother":
					r3="";
					break;
				case "wife":
					r3="外婆";
					break;
				case "husband":
					r3="外公";
					break;
				case "son":
					r3="舅舅";
					break;
				case "daughter":
					r3="阿姨";
					break;
				default:;
				}
				break;
			case "儿子":
				switch(r2){
				case "father":
					r3="我";
					break;
				case "mother":
					r3="妻子";
					break;
				case "wife":
					r3="儿媳妇";
					break;
				case "husband":
					r3="女婿";
					break;
				case "son":
					r3="孙子";
					break;
				case "daughter":
					r3="孙女";
					break;
				default:;
				}
				break;
			case "儿媳妇":
				switch(r2){
				case "father":
					r3="亲家公";
					break;
				case "mother":
					r3="亲家母";
					break;
				case "wife":
					r3="儿媳妇";
					break;
				case "husband":
					r3="儿子";
					break;
				case "son":
					r3="孙子";
					break;
				case "daughter":
					r3="孙女";
					break;
				default:;
				}
				break;
			case "女儿":
				switch(r2){
				case "father":
					r3="我";
					break;
				case "mother":
					r3="妻子";
					break;
				case "wife":
					r3="儿媳妇";
					break;
				case "husband":
					r3="女婿";
					break;
				case "son":
					r3="外孙";
					break;
				case "daughter":
					r3="外孙女";
					break;
				default:;
				}
				break;
			case "孙子":
			case "孙女":
				switch(r2){
				case "father":
					r3="儿子";
					break;
				case "mother":
					r3="儿媳妇";
					break;
				case "wife":
					r3="孙媳妇";
					break;
				case "husband":
					r3="孙女婿";
					break;
				case "son":
					//r3="孙子";
					break;
				case "daughter":
					//r3="孙女";
					break;
				default:;
				}
				break;
			case "外孙":
			case "外孙女":
				switch(r2){
				case "father":
					r3="女儿";
					break;
				case "mother":
					r3="女婿";
					break;
				case "wife":
					r3="外孙媳妇";
					break;
				case "husband":
					r3="外孙女婿";
					break;
				case "son":
					//r3="孙子";
					break;
				case "daughter":
					//r3="孙女";
					break;
				default:;
				}
				break;
			default:;
			}
			return r3;
		}
	};
})(jQuery);