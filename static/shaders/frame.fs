#define PI 3.1415926538
precision mediump float;

// inputs


varying lowp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uKern0;
uniform sampler2D uKern1;
uniform sampler2D uKern2;
uniform sampler2D uKern3;
uniform sampler2D uKern4;
uniform sampler2D uKern5;
uniform int uKernelRadius;
uniform float uTextureDims[2];
uniform float uDebug;
uniform float sigmoids[16];
uniform float slopes[16];
uniform int isPaused;
uniform float brush[3];




highp vec4 getPixel(mediump vec2 coord, float offsetX, float offsetY){
    coord.x = mod( coord.x	+ offsetX + 1.0, 1.0);
    coord.y = mod( coord.y	+ offsetY + 1.0, 1.0);
    return texture2D(uSampler, coord);
}



// sigmoid
float s0(float x,float a,float alpha) 
{ 
    return 1.0 / ( 1.0 + exp( -(x-a)*4.0/alpha ) );
}
// 2 sided sigmoid
float s1(float x,float a,float b,float alpha0, float alpha1)
{
    return s0(x,a,alpha0) 
        * ( 1.0-s0(x,b,alpha1) );
}
float t(float m,float n)
{
    float max = 0.0;
    for(int i = 0; i < 4; i++){
        float a = min(s1( m, sigmoids[i*4+0], sigmoids[i*4+1], slopes[i*4+0], slopes[i*4+1]) , s1( n, sigmoids[i*4+2], sigmoids[i*4+3], slopes[i*4+2], slopes[i*4+3]));
        if(a > max)
            max = a;
    }
    return max;
}


// Catmull-Rom spline







float processPixel(){
 
    const float r = 12.;
    
    highp float inner = 0.;
    highp float outer = 0.;

    float count_inner = 0.;
    float count_outer = 0.;

    


    for(float i = -r+1.; i < r; i++){
        for(float j = -r+1.; j < r; j++){
            float i_f = i / uTextureDims[0];
            float j_f = j / uTextureDims[1];
            float dist = distance(vec2(i_f * uTextureDims[0], j_f * uTextureDims[1]), vec2(0.,0.)); 	

            if( dist < r){
                //float k = cos(1.*PI*dist/r)*0.5+0.5;


                float k =  texture2D(uKern0,vec2(0.5+i/r, 0.5+j/r)).r;
                inner += getPixel(vTextureCoord ,i_f, j_f ).r*k;
                count_inner+=k;
            

                //k = cos(2.*PI*dist/r)*0.5+0.5;
                k = texture2D(uKern1,vec2(0.5+i/r, 0.5+j/r)).r;
                outer += getPixel(vTextureCoord ,i_f, j_f ).r*k;
                count_outer+=k;
            }
        }
    }


    inner = inner/count_inner;
    outer = outer/count_outer;
    float result = t(inner,outer);

    return result;

 
}

void main(void) {
    mediump vec4 tex = texture2D(uSampler, vTextureCoord);
    
    //process pixel value
    if(isPaused == 0){
        float d = processPixel(); 
        tex.g = tex.r;
        tex.r = clamp(tex.r + ((d*2.-1.) * 0.5), 0.0, 1.0);
    }

    //draw
    if(brush[0] != -1.){
        if(distance(vec2(0.,0.),vec2((vTextureCoord.x-brush[0])*uTextureDims[0],(vTextureCoord.y-brush[1])*uTextureDims[1])) < brush[2])
            {
                tex.rg = vec2(sin((vTextureCoord.x-brush[0])*100.*PI)*0.2+0.8);
            }
    }
    
    // if(brush[0] != -1.){

    //     float s = 256.;
    //     vec2 relPos = vec2((vTextureCoord.x-brush[0])*uTextureDims[0]+brush[2]/2.,(vTextureCoord.y-brush[1])*uTextureDims[1]+brush[2]/2.);


    //     if( relPos.x >= 0. && relPos.x < brush[2] 
    //         && relPos.y >=0. && relPos.y < brush[2]
    //     )
    //     {
    //         // toDo: calculate pos
    //         tex.rgba = texture2D(uKern0,
    //             vec2(
    //                 relPos.x / brush[2], 
    //                 relPos.y / brush[2]
    //                 )
    //         );
    //     }
    // }


 


    gl_FragColor = tex;
}