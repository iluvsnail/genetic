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
			if(this.y+this.r+20>GENETIC.paper.height){
				GENETIC.paper.setSize(GENETIC.paper.width,this.y+this.r+20);
			}
			switch (this.gender) {
			case "male":
				var circle = GENETIC.paper.circle(this.x, this.y, this.r);
				circle.click(function(){
					var div =GENETIC.tool.createMenu(this);
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
				GENETIC.paper.path(
						"M" + start_x + " " + start_y + "L" + end_x + " "
								+ end_y + "M" + (end_x + 5) + " " + (end_y)
								+ "L" + (end_x) + " " + (end_y + 20) + "M"
								+ end_x + " " + (end_y + 5) + "L"
								+ (end_x + 20) + " " + (end_y)).attr({
					"stroke" : "#2f6ab6",
					"stroke-width" : 5
				});
				GENETIC.paper.text(this.x, this.y + this.r + 10, this.relation
						+ "(" + this.name + ")");
				break;
			case "female":
				var circle2 = GENETIC.paper.circle(this.x, this.y, this.r);
				circle2.attr({
					"fill" : "#fff",
					"stroke" : "#e78083",
					"stroke-width" : 5
				});
				GENETIC.paper.path(
						"M" + this.x + " " + (this.y + this.r) + "L" + this.x
								+ " " + (this.y + this.r * 3) + "M"
								+ (this.x - this.r) + " "
								+ (this.y + this.r * 2) + "L"
								+ (this.x + this.r) + " "
								+ (this.y + this.r * 2)).attr({
					"stroke" : "#e78083",
					"stroke-width" : 5
				});
				GENETIC.paper.text(this.x, this.y + this.r * 3 + 10,
						this.relation + "(" + this.name + ")");
				break;
			default:
				;
			}
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
			GENETIC.paper.path(
					"M" + start_x + " " + start_y + "L" + start_x + " "
							+ (end_y + male.r) + "L" + (end_x) + " "
							+ (end_y + female.r) + "L" + (end_x) + " "
							+ (end_y)).attr({
				"stroke" : "black",
				"stroke-width" : 1
			});
		},
		drawChildrenLine : function(male, female) {
			var start_x = male.x + (female.x - male.x) / 2;
			var start_y = male.y + male.r * 3;
			GENETIC.paper.path(
					"M" + start_x + " " + start_y + "L" + start_x + " "
							+ (start_y + male.r)).attr({
				"stroke" : "black",
				"stroke-width" : 1
			});

		},
		drawChildLine : function(male, female, ch) {
			var start_x = ch.x;
			var start_y = ch.y - male.r * (ch.gender == "male" ? 3 : 1);
			var end_x = male.x + (female.x - male.x) / 2;
			var end_y = male.y + male.r * 4;
			GENETIC.paper.path(
					"M" + start_x + " " + start_y + "L" + start_x + " "
							+ (start_y - male.r) + "L" + end_x + " " + (end_y))
					.attr({
						"stroke" : "black",
						"stroke-width" : 1
					});

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
		createMenu:function(svg){
			var x =svg.attr("cx");
			var y =svg.attr("cy");
			var div =$("<div />").css({
				"left":x,
				"top" :y
			}).addClass("menu");
			var li=GENETIC.tool.createItem("添加父亲",function(){
				alert("父亲");
				$("div.menu").has(this).hide();
			});
			var li2=GENETIC.tool.createItem("添加母亲",function(){
				alert("母亲");
				$("div.menu").has(this).hide();
			});
			var li3=GENETIC.tool.createItem("添加儿子",function(){
				alert("儿子");
				$("div.menu").has(this).hide();
			});
			var li4=GENETIC.tool.createItem("添加女儿",function(){
				alert("女儿");
				$("div.menu").has(this).hide();
			});
			var li5=GENETIC.tool.createItem("添加妻子",function(){
				alert("妻子");
				$("div.menu").has(this).hide();
			});
			var li6=GENETIC.tool.createItem("修改信息",function(){
				alert("信息");
				$("div.menu").has(this).hide();
			});

			$(div).append(li6);
			$(div).append(li);
			$(div).append(li2);
			$(div).append(li5);
			$(div).append(li3);
			$(div).append(li4);
			return div;
		},
		createItem : function(text,fn){
			return $("<li />").addClass("menuItem").text(text).click(fn);
		}
	};
})(jQuery);