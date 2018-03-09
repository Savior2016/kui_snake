//snake.js
var app = getApp();

Page({
   data:{
        message_snake:"kui_snake",
        message_count:0,
        message_lenth:5,
        message_info:["蛇的长度不能超过40","绿点变短，紫点变长","长度会随时间增加","加速时长度自增减缓","kui_snake"],
        score: 20,//比分
        stepadd:5,
        maxscore: 0,//最高分
        startx: 0,
        starty: 0,
        endx:0,
        endy:0,//以上四个做方向判断来用
        ground:[],//存储操场每个方块
        rows:40,
        cols:32,//操场大小
        snake:[],//存蛇
        food:[],//存食物
        direction:'',//方向
        modalHidden: true,
        start_flag:0,//0 为未开始 1为开始游戏
        timer:''
   } ,
   onLoad:function(){
     
       var maxscore = wx.getStorageSync('maxscore');
       if(!maxscore) maxscore = 20
        this.setData({
        maxscore:maxscore
        });
        
        this.initGround(this.data.rows,this.data.cols);//初始化操场
        this.initSnake(20);//初始化蛇
        this.initwall(40);//wall
        this.creatFood();//初始化食物
        
        this.move();//蛇移动

        wx.showToast({
          title: "点击方向键开始",
          icon: "loading",
          duration: 1000
        })

        
   },
   //计分器
    storeScore:function(){

      if(this.data.maxscore > this.data.score){
      this.setData({
        maxscore:this.data.score
        })
        wx.setStorageSync('maxscore', this.data.maxscore)
      }
  },
  //操场
    initGround:function(rows,cols){
        for(var i=0;i<rows;i++){
            var arr=[];
            this.data.ground.push(arr);
            for(var j=0;j<cols;j++){
                this.data.ground[i].push(0);
            }
        }
    },
   //蛇
   initSnake:function(len){
       for(var i=0;i<len;i++){
           if(i==(len-1))
           {
             this.data.ground[0][i] = 3;
           }
           else
           {
             this.data.ground[0][i] = 1;
           }
           
           this.data.snake.push([0,i]);
       }
   },

   //wall
   initwall: function (len) {
     for(var i=0;i<len;i++)
     {
       var x = Math.floor(Math.random() * this.data.rows);
       var y = Math.floor(Math.random() * this.data.cols);

       var ground = this.data.ground;
       if (ground[x][y] == 0) {
         ground[x][y] = 4;
         this.setData({
           ground: ground,
           food: [x, y]
         });
       }
       else {
         this.initwall();
       }
     }
     
   },
   //移动函数
   move:function(){
       var that=this;
       
       this.data.timer=setInterval(function(){
           that.changeDirection(that.data.direction);
                   
            that.setData({
               
               ground:that.data.ground,
               
           });

            if (that.data.stepadd == 0) {
              var arr = that.data.snake;
              var snakeTAIL = arr[0];
              arr.unshift(snakeTAIL);  

              var count = that.data.message_count;
              if (count == that.data.message_lenth)
              {
                count=0;
              }
              else
              {
                count = count+1;
              }


              that.setData({

                score: that.data.score + 1,
                stepadd:30,
                message_snake: that.data.message_info[that.data.message_count],
                message_count: count,
                 
              });
              
              that.storeScore();
              
            }
            else
            {
              if (that.data.start_flag==1)
              {
                that.setData({

                  stepadd: that.data.stepadd - 1,

                });
              }
              
            }
         

            
       },380);
   },
   speedup:function ()
   {
     var that = this;
     clearInterval(this.data.timer);

     this.data.timer = setInterval(function () {
       that.changeDirection(that.data.direction);
       that.setData({

         ground: that.data.ground,

       });

       if (that.data.stepadd == 0) {
         var arr = that.data.snake;
         var snakeTAIL = arr[0];
         arr.unshift(snakeTAIL);
         that.setData({

           score: that.data.score + 1,
           stepadd: 150,

         });

         that.storeScore();

       }
       else {
         if (that.data.start_flag == 1) {
           that.setData({

             stepadd: that.data.stepadd - 1,

           });
         }
       }



     }, 80);
   },
   speedlow: function () {
     var that = this;
     clearInterval(this.data.timer);
     this.data.timer = setInterval(function () {
       that.changeDirection(that.data.direction);
       that.setData({

         ground: that.data.ground,

       });
       if (that.data.stepadd == 0) {
         var arr = that.data.snake;
         var snakeTAIL = arr[0];
         arr.unshift(snakeTAIL);
         that.setData({

           score: that.data.score + 1,
           stepadd: 30,

         });

         that.storeScore();

       }
       else {
         if (that.data.start_flag == 1) {
           that.setData({

             stepadd: that.data.stepadd - 1,

           });
         }
       }
     }, 380);
   },
    tapStart: function(event){
        this.setData({
            startx: event.touches[0].pageX,
            starty: event.touches[0].pageY
            })
    },
    tapMove: function(event){
        this.setData({
            endx: event.touches[0].pageX,
            endy: event.touches[0].pageY
            })
    },
    btntop:function(){
      var direction="top";
      if (this.data.direction == 'bottom')
      {
        return;
      }
      this.setData({
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0,
        direction: direction,
        start_flag:1,
      })
    },
    btnright: function () {
      var direction = "right";
      if (this.data.direction == 'left') {
        return;
      }
      this.setData({
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0,
        direction: direction,
        start_flag: 1,
      })
    },
    btnbottom: function () {
      var direction = "bottom";
      if (this.data.direction == 'top') {
        return;
      }
      this.setData({
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0,
        direction: direction,
        start_flag: 1,
      })
    },
    btnleft: function () {
      var direction = "left";
      if (this.data.direction == 'right') {
        return;
      }
      this.setData({
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0,
        direction: direction,
        start_flag: 1,
      })
    },

    tapEnd: function(event){
        var heng = (this.data.endx) ? (this.data.endx - this.data.startx) : 0;
        var shu = (this.data.endy) ? (this.data.endy - this.data.starty) : 0;

        if(Math.abs(heng) > 5 || Math.abs(shu) > 5){
            var direction = (Math.abs(heng) > Math.abs(shu)) ? this.computeDir(1, heng):this.computeDir(0, shu);
            switch(direction){
            case 'left':
                if(this.data.direction=='right')return;
                break;
            case 'right':
                if(this.data.direction=='left')return;
                break;
            case 'top':
                if(this.data.direction=='bottom')return;
                break;
            case 'bottom':
                if(this.data.direction=='top')return;
                break;
            default:
        }
        this.setData({
        startx:0,
        starty:0,
        endx:0,
        endy:0,
        direction:direction
        })
        
    }
    },
    computeDir: function(heng, num){
    if(heng) return (num > 0) ? 'right' : 'left';
    return (num > 0) ? 'bottom' : 'top';
    },

    creatFood:function(){  //设定食物
        var x=Math.floor(Math.random()*this.data.rows);
        var y=Math.floor(Math.random()*this.data.cols);
        
        var ground= this.data.ground;
        if (ground[x][y]==0)
        {
          ground[x][y] = 2;
          this.setData({
            ground: ground,
            food: [x, y]
          });
        }
        else
        {
          this.creatFood();
        }
        
    },
    changeDirection:function(dir){
        switch(dir){
        case 'left':
            return this.changeLeft();
            break;
        case 'right':
            return this.changeRight();
            break;
        case 'top':
            return this.changeTop();
            break;
        case 'bottom':
            return this.changeBottom();
            break;
        default:
        }
    },
    changeLeft:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0];
        var y=arr[len-1][1]-1;
        arr[len-1]=[x,y];
            this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        ground[arr[len-1][0]][arr[len-1][1]] = 3;
        
    this.setData({
                ground:ground,
            snake:arr
        });
        
        return true;
    },
    changeRight:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0];
        var y=arr[len-1][1]+1;
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;

        } 
        ground[arr[len - 1][0]][arr[len - 1][1]] = 3;
        
        this.setData({
                ground:ground,
            snake:arr
        });
        
        
    //    var y=this.data.snake[0][1];
    //    var x=this.data.snake[0][0];
    //     this.data.ground[x][y]=0;
    //     console.log(this.data.ground[x]);
    //      console.log(this.data.snake);
    //     for(var i=0;i<this.data.snake.length-1;i++){
    //         this.data.snake[i]=this.data.snake[i+1];
    //     }
    //     this.data.snake[this.data.snake.length-1][1]++;
    //     for(var j=1;j<this.data.snake.length;j++){
    //         this.data.ground[this.data.snake[j][0]][this.data.snake[j][1]]=1;
    //     }
        return true;
    },
    changeTop:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0]-1;
        var y=arr[len-1][1];
        arr[len-1]=[x,y];
            this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        ground[arr[len - 1][0]][arr[len - 1][1]] = 3;
        this.setData({
            ground:ground,
            snake:arr
        });
      
        return true;
    },
    changeBottom:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };
        var x=arr[len-1][0]+1;
        var y=arr[len-1][1];
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        for(var i=1;i<len;i++){
            ground[arr[i][0]][arr[i][1]]=1;
        } 
        ground[arr[len - 1][0]][arr[len - 1][1]] = 3;
        this.setData({
            ground:ground,
            snake:arr
        });
        return true;
    },
    checkGame:function(snakeTAIL){
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        if(snakeHEAD[0]<0||snakeHEAD[0]>=this.data.rows||snakeHEAD[1]>=this.data.cols||snakeHEAD[1]<0){
                clearInterval(this.data.timer);
                    this.setData({
                    modalHidden: false,
                        })  
        }//越界检测
        for(var i=0;i<len-1;i++){
            if(arr[i][0]==snakeHEAD[0]&&arr[i][1]==snakeHEAD[1]){
                clearInterval(this.data.timer);
                    this.setData({
                        modalHidden: false,
                    })
            }
        }//撞到自身检测
        if(snakeHEAD[0]==this.data.food[0]&&snakeHEAD[1]==this.data.food[1]){
            arr.shift(snakeTAIL);
            this.setData({
                score:this.data.score- 1
            });
            this.storeScore();
            this.creatFood();
        }//吃到食物检测

        if (this.data.ground[snakeHEAD[0]][snakeHEAD[1]]==4) {
          arr.unshift(snakeTAIL);
          arr.unshift(snakeTAIL);
          arr.unshift(snakeTAIL);
          this.setData({
            score: this.data.score + 3
          });
          this.storeScore();
          this.creatwall(5);
          
        }//触碰处罚点检测
        
        if (this.data.score>40)
        {
          this.setData({
            modalHidden: false,
          })
        }
        else if (this.data.score < 5)
        {
          wx.showModal({
            title: "通关成功",
            content: "恭喜你通关游戏！！！",
            showCancel: false,
            confirmText: "确定"
          });
          this.setData({
            score: 30,
            ground: [],
            snake: [],
            food: [],
            direction: ''
          })
          this.onLoad();
        }
        
        
    },
    modalChange:function(){
    this.setData({
            score: 20,
        ground:[],
        snake:[],
            food:[],
            modalHidden: true,
            direction:'',
            start_flag:0,
    })
    this.onLoad();
    }

  
});