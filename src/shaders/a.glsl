varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform highp float uProcessVal;


highp vec4 getPixel(highp vec2 coord, highp float offsetX,highp float offsetY){

  coord.x += offsetX;
  coord.y += offsetY;
  return texture2D(uSampler, coord);
}

highp float processPixel(highp vec2 tex){
 
  // 0.007 is the 1/128px
  const highp float mtpl = 1./256.;


  const int r = 16;
  
  highp float inner = 0.;
  highp float outer = 0.;

  int count_inner = 0;
  int count_outer = 0;


  for(int i = -r+1; i < r; i++){
    for(int j = -r+1; j < r; j++){
    
      mediump float i_f = float(i) * mtpl;
      mediump float j_f = float(j) * mtpl;
      mediump float dist = sqrt(pow(i_f,2.) + pow(j_f,2.));

        if( dist <  float(r)*mtpl/1.6)
        {
          inner += getPixel(vTextureCoord ,i_f, j_f ).r;
          count_inner++;
        }
        else if( dist < float(r)*mtpl){
          outer += getPixel(vTextureCoord ,i_f, j_f ).r;
          count_outer++;
        }
    }
  }

    inner = inner/float(count_inner);
    outer = outer/float(count_outer);

    highp float result = -0.04;
    
    if (inner < 0.3 && outer > 0.2 && outer < 0.4)
          result = 0.04;

  return result;
}

void main(void) {


  highp vec4 tex = texture2D(uSampler, vTextureCoord);
  

  if(uProcessVal > 0.0)
  	tex = tex + processPixel(vTextureCoord);
  	//if( sqrt(pow(vTextureCoord.x-0.5,2.) + pow(vTextureCoord.y-0.5,2.)) < 0.1)
  

  
gl_FragColor = tex; 
}