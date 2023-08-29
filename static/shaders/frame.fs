#define PI 3.1415926538
precision mediump float;

// inputs


varying lowp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uKern;

uniform int uKernelRadius;
uniform float uTextureDims[2];
uniform float uDebug;
uniform float uDelta;
uniform float uRules[64];

uniform int uNumberOfKernels;
uniform int uNumberOfRules;

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
float t(float m,float n, float o,float p)
{
    float result = 0.0;
    for(int i = 0; i < 4; i++){

        if(i < uNumberOfRules)
        {
            float a = s1( m, uRules[i*16+0], uRules[i*16+1], uRules[i*16+2], uRules[i*16+3]);
            a = min(a, s1( n, uRules[i*16+4], uRules[i*16+5], uRules[i*16+6], uRules[i*16+7]));
            a = min(a, s1( o, uRules[i*16+8], uRules[i*16+9], uRules[i*16+10], uRules[i*16+11]));
            a = min(a, s1( p, uRules[i*16+12], uRules[i*16+13], uRules[i*16+14], uRules[i*16+15]));
            result = max(result, a);
        }
        
    }
    return result;
}




highp vec4 getKernelValue(int idx, vec2 coord){
    coord.x /= 64.;
    // coord.y /= 256.;
    coord.y /= 256.;

    coord.y += ( (64.* float(idx)) / 256. );

    
    return texture2D(uKern, coord);
}

float processPixel(){
 
    float r = float(uKernelRadius);
    
    // sum of convolution
    float k0 = 0.;
    float k1 = 0.;
    float k2 = 0.;
    float k3 = 0.;

    // sum of weights
    float count_k0 = 0.;
    float count_k1 = 0.;
    float count_k2 = 0.;
    float count_k3 = 0.;




    for(float i = -15.; i < 16.; i++){
        for(float j = -15.; j < 16.; j++){
            
            float dist = distance(vec2(i,j), vec2(0.,0.));
            if( dist < r)
            {
                float i_f = (i) / uTextureDims[0];
                float j_f = (j) / uTextureDims[1];
                float pix = getPixel(vTextureCoord ,i_f, j_f ).r; 

                vec2 kernPos = vec2(i+r-0.5, j+r-0.5);
                
                float k =  getKernelValue(0, kernPos).r;
                k0 += pix*k;
                count_k0+=k;
                
                k = getKernelValue(1,  kernPos).r;
                k1 += pix*k;
                count_k1+=k;

                k = getKernelValue(2,  kernPos).r;
                k2 += pix*k;
                count_k2+=k;

                k = getKernelValue(3,  kernPos).r;
                k3 += pix*k;
                count_k3+=k;
            }
        }
    }


    k0 = k0/count_k0;
    k1 = k1/count_k1;
    k2 = k2/count_k2;
    k3 = k3/count_k3;
    float result = t(k0, k1, k2, k3);

    return result;

 
}

void main(void) {
    mediump vec4 tex = texture2D(uSampler, vTextureCoord);
    
    //process pixel value
    if(isPaused == 0){
        float d = processPixel(); 
        tex.g = tex.r;
        tex.r = clamp(tex.r + ((d*2.-1.) * uDelta), 0.0, 1.0);
    }

    //draw
    if(brush[0] != -1.){
        if(distance(vec2(0.,0.),vec2((vTextureCoord.x-brush[0])*uTextureDims[0],(vTextureCoord.y-brush[1])*uTextureDims[1])) < brush[2])
            {
                tex.rg = vec2(sin((vTextureCoord.x-brush[0])*100.*PI)*0.2+0.8);
            }
    }
    


 


    gl_FragColor = tex;
}