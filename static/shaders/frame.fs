#define PI 3.1415926538
precision mediump float;

// inputs


varying lowp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uTextureDims[2];
uniform float uDebug;
uniform float params[16];
uniform float slopes[16];
uniform int isPaused;
uniform float brush[3];


highp vec4 getPixel(mediump vec2 coord, float offsetX, float offsetY){
    coord.x = mod( coord.x	+ offsetX + 1.0, 1.0);
    coord.y = mod( coord.y	+ offsetY + 1.0, 1.0);
    
    return texture2D(uSampler, coord);
}

float s1(float x,float a,float alpha) 
{ 
    return 1.0 / ( 1.0 + exp( -(x-a)*4.0/alpha ) );
}
float s2(float x,float a,float b,float alpha0, float alpha1)
{
    return s1(x,a,alpha0) 
        * ( 1.0-s1(x,b,alpha1) );
}
float t(float m,float n)
{
    const float slope = 0.1;
    //ToDo: change this later, remove the hardcoded value
    float max = 0.0;
    for(int i = 0; i < 4; i++){
        float a = min(s2( m, params[i*4+0], params[i*4+1], slopes[i*4+0], slopes[i*4+1]) , s2( n, params[i*4+2], params[i*4+3], slopes[i*4+2], slopes[i*4+3]));

        if(a > max)
            max = a;
    }
    return max;
}
float processPixel(){
 

    const int r = 16;
    
    mediump float inner = 0.;
    mediump float outer = 0.;

    int count_inner = 0;
    int count_outer = 0;


    for(int i = -r+1; i < r; i++){
        for(int j = -r+1; j < r; j++){

            mediump float i_f = float(i) / uTextureDims[0];
            mediump float j_f = float(j) / uTextureDims[1];
            
            mediump float dist = distance(vec2(i_f * uTextureDims[0], j_f * uTextureDims[1]), vec2(0.,0.)); 	

            if( dist <  float(r)/3.)
            {
                inner += getPixel(vTextureCoord ,i_f, j_f ).r;
                count_inner++;
            }
            else if( dist < float(r)){
                outer += getPixel(vTextureCoord ,i_f, j_f ).r;
                count_outer++;
            }
        }
    }


    highp float result = -0.2;


    inner = inner/float(count_inner);
    outer = outer/float(count_outer);
    // inner = cos(PI*4.*inner)*0.5+0.5;
    // outer = sin(PI*4.*outer)*0.5+0.5;
    // if (
    //   ( inner > params[0] && inner < params[1]  && outer > params[2] &&  outer < params[3]  )  || 
    //   ( inner > params[4]  && inner < params[5] && outer > params[6]  && outer < params[7]  )  ||
    //   ( inner > params[8] && inner < params[9]  && outer > params[10] &&  outer < params[11]  )  || 
    //   ( inner > params[12] && inner < params[13]  && outer > params[14] &&  outer < params[15]  )  
    // ) 
    //     result *= -1.;

    
    result = t(inner,outer);

   
      
    
    


    return result;

 
}

void main(void) {
    mediump vec4 tex = texture2D(uSampler, vTextureCoord);
    
    if(isPaused == 0){
        float d = processPixel(); 

        tex.r = clamp(tex.r + ((d*2.-1.) * 0.3), 0.0, 1.0);

       
        

    }
    // draw
    if(brush[0] != -1.){
        if(distance(vec2(0.,0.),vec2(vTextureCoord.x-brush[0],vTextureCoord.y-brush[1])) < brush[2])
            {
                  tex.r = sin(vTextureCoord.x*100.*PI)*0.5+0.5;
            }
    
    }
    

    gl_FragColor = tex;
}