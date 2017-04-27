####一.状态过度动画
#####transition：

    img{
      transition-property: height;
      transition-duration: 1s;
      transition-delay: 1s;
      transition-timing-function: ease;//状态变化速度
    }

#####animation:

    div:hover {
      animation-duration: 1s;
      animation-delay: 1s;
      animation-name: rainbow;
      animation-timing-function: linear;
      animation-iteration-count: 3;//动画被播放的次数
      animation-fill-mode:forwards;//动画结束后的状态
      animation-direction: normal;//下一周期动画方向
    }

####二.改变动画
转换：对元素进行移动（translate）、缩放(scale)、转动(rotate)、倾斜(skew)或拉伸(matrix)

改变起点位置 transform-origin: bottom left;

所有的2D转换方法组合在一起： matrix()  旋转、缩放、移动以及倾斜元素
matrix(scale.x ,, , scale.y , translate.x, translate.y)      
