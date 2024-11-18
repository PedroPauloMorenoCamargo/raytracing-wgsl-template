const THREAD_COUNT = 16;
const RAY_TMIN = 0.0001;
const RAY_TMAX = 100.0;
const PI = 3.1415927f;
const FRAC_1_PI = 0.31830987f;
const FRAC_2_PI = 1.5707964f;

@group(0) @binding(0)  
  var<storage, read_write> fb : array<vec4f>;

@group(0) @binding(1)
  var<storage, read_write> rtfb : array<vec4f>;

@group(1) @binding(0)
  var<storage, read_write> uniforms : array<f32>;

@group(2) @binding(0)
  var<storage, read_write> spheresb : array<sphere>;

@group(2) @binding(1)
  var<storage, read_write> quadsb : array<quad>;

@group(2) @binding(2)
  var<storage, read_write> boxesb : array<box>;

@group(2) @binding(3)
  var<storage, read_write> trianglesb : array<triangle>;

@group(2) @binding(4)
  var<storage, read_write> meshb : array<mesh>;

struct ray {
  origin : vec3f,
  direction : vec3f,
};

struct sphere {
  transform : vec4f,
  color : vec4f,
  material : vec4f,
};

struct quad {
  Q : vec4f,
  u : vec4f,
  v : vec4f,
  color : vec4f,
  material : vec4f,
};

struct box {
  center : vec4f,
  radius : vec4f,
  rotation: vec4f,
  color : vec4f,
  material : vec4f,
};

struct triangle {
  v0 : vec4f,
  v1 : vec4f,
  v2 : vec4f,
};

struct mesh {
  transform : vec4f,
  scale : vec4f,
  rotation : vec4f,
  color : vec4f,
  material : vec4f,
  min : vec4f,
  max : vec4f,
  show_bb : f32,
  start : f32,
  end : f32,
};

struct material_behaviour {
  scatter : bool,
  direction : vec3f,
};

struct camera {
  origin : vec3f,
  lower_left_corner : vec3f,
  horizontal : vec3f,
  vertical : vec3f,
  u : vec3f,
  v : vec3f,
  w : vec3f,
  lens_radius : f32,
};

struct hit_record {
  t : f32,
  p : vec3f,
  normal : vec3f,
  object_color : vec4f,
  object_material : vec4f,
  frontface : bool,
  hit_anything : bool,
};

fn ray_at(r: ray, t: f32) -> vec3f
{
  return r.origin + t * r.direction;
}

fn get_ray(cam: camera, uv: vec2f, rng_state: ptr<function, u32>) -> ray
{
  var rd = cam.lens_radius * rng_next_vec3_in_unit_disk(rng_state);
  var offset = cam.u * rd.x + cam.v * rd.y;
  return ray(cam.origin + offset, normalize(cam.lower_left_corner + uv.x * cam.horizontal + uv.y * cam.vertical - cam.origin - offset));
}

fn get_camera(lookfrom: vec3f, lookat: vec3f, vup: vec3f, vfov: f32, aspect_ratio: f32, aperture: f32, focus_dist: f32) -> camera
{
  var camera = camera();
  camera.lens_radius = aperture / 2.0;

  var theta = degrees_to_radians(vfov);
  var h = tan(theta / 2.0);
  var w = aspect_ratio * h;

  camera.origin = lookfrom;
  camera.w = normalize(lookfrom - lookat);
  camera.u = normalize(cross(vup, camera.w));
  camera.v = cross(camera.u, camera.w);

  camera.lower_left_corner = camera.origin - w * focus_dist * camera.u - h * focus_dist * camera.v - focus_dist * camera.w;
  camera.horizontal = 2.0 * w * focus_dist * camera.u;
  camera.vertical = 2.0 * h * focus_dist * camera.v;

  return camera;
}

fn envoriment_color(direction: vec3f, color1: vec3f, color2: vec3f) -> vec3f
{
  var unit_direction = normalize(direction);
  var t = 0.5 * (unit_direction.y + 1.0);
  var col = (1.0 - t) * color1 + t * color2;

  var sun_direction = normalize(vec3(uniforms[13], uniforms[14], uniforms[15]));
  var sun_color = int_to_rgb(i32(uniforms[17]));
  var sun_intensity = uniforms[16];
  var sun_size = uniforms[18];

  var sun = clamp(dot(sun_direction, unit_direction), 0.0, 1.0);
  col += sun_color * max(0, (pow(sun, sun_size) * sun_intensity));

  return col;
}

fn check_ray_collision(r: ray, max: f32) -> hit_record{
  let spheresCount = i32(uniforms[19]);
  var quadsCount = i32(uniforms[20]);
  var boxesCount = i32(uniforms[21]);
  var trianglesCount = i32(uniforms[22]);
  var meshCount = i32(uniforms[27]);
  // Inicializa com a maior raio possível
  var record = hit_record(RAY_TMAX, vec3f(0.0), vec3f(0.0), vec4f(0.0), vec4f(0.0), false, false);
  // Inicializa o mais próximo com a maior distância possível
  var closest = record;

  // Checa as colisões com as esferas
  for (var i = 0; i < spheresCount; i = i + 1){
      // Pega a esfera atual
      let sphere = spheresb[i];
      // Checa se a esfera foi atingida
      hit_sphere(sphere.transform.xyz, sphere.transform.w, r, &record, max);
      // Se a esfera foi atingida e a distância é menor que a menor distância encontrada até agora
      if (record.hit_anything && record.t < closest.t){
          // Atualiza a menor distância
          closest = record;
          closest.object_color = sphere.color;
          closest.object_material = sphere.material;
      }
  }

  // Checa as colisões com os quadrados
  for (var i = 0; i < quadsCount; i = i + 1){
      // Pega o quadrado atual
      let quad = quadsb[i];
      // Checa se o quadrado foi atingido
      hit_quad(r, quad.Q, quad.u, quad.v, &record, max);
      // Se o quadrado foi atingido e a distância é menor que a menor distância encontrada até agora
      if (record.hit_anything && record.t < closest.t){
          // Atualiza a menor distância
          closest = record;
          closest.object_color = quad.color;
          closest.object_material = quad.material;
      }
  }

  // Checa as colisões com as caixas
  for (var i = 0; i < boxesCount; i = i + 1){
      // Pega a caixa atual
      let box = boxesb[i];
      // Checa se a caixa foi atingida
      hit_box(r, box.center.xyz, box.radius.xyz, box.rotation, &record, max);
      // Se a caixa foi atingida e a distância é menor que a menor distância encontrada até agora
      if (record.hit_anything && record.t < closest.t){
          // Atualiza a menor distância
          closest = record;
          closest.object_color = box.color;
          closest.object_material = box.material;
      }
  }

  // Checa as colisões com as meshes
  for (var i = 0; i < meshCount; i = i + 1){
      // Pega o mesh atual
      let mesh = meshb[i];

      // Pega os valores da bounding box
      let min_mesh = mesh.min.xyz*mesh.scale.xyz + mesh.transform.xyz;
      let max_mesh = mesh.max.xyz*mesh.scale.xyz + mesh.transform.xyz;
      // Calcula o centro e o raio da bounding box
      let box_center = (min_mesh + max_mesh) *0.5;
      let box_radius = (max_mesh - min_mesh) * 0.5;

      // Checa se o raio atinge a bounding box
      hit_box(r, box_center, box_radius,mesh.rotation, &record, max);
      // Se a bounding box foi atingida
      if (record.hit_anything && record.t < closest.t){
            // Checa os triângulos da mesh
        for (var j = i32(mesh.start); j < i32(mesh.end); j = j + 1){
            // Pega o triângulo atual
            let triangle = trianglesb[j];
            //Escalona o triângulo
            var v0 = triangle.v0.xyz;
            var v1 = triangle.v1.xyz;
            var v2 = triangle.v2.xyz;

            v0 *= mesh.scale.xyz;
            v1 *= mesh.scale.xyz;
            v2 *= mesh.scale.xyz;

            v0 += mesh.transform.xyz;
            v1 += mesh.transform.xyz;
            v2 += mesh.transform.xyz;

  

            
            // Checa se o triângulo foi atingido
            hit_triangle(r, v0, v1, v2, &record, max);
            // Se o triângulo foi atingido e a distância é menor que a menor distância encontrada até agora
            if (record.hit_anything && record.t < closest.t){
                // Atualiza a menor distância
                closest = record;
                closest.object_color = mesh.color;
                closest.object_material = mesh.material;
            }
        }
      }
  }

  let normal = closest.normal;
  //Checa se o raio atingiu por dentro ou por fora
  closest.frontface = dot(r.direction, normal) < 0.0;
  //Se atingiu por dentro, inverte a normal
  closest.normal = select(-normal, normal, closest.frontface);
  return closest;
}

//Função que calcula a reflexão de um vetor
fn reflect(v: vec3f, n: vec3f) -> vec3f {
  // Raio Refletido R = D - 2 * (D.N) * N
  return v - 2.0 * dot(v, n) * n;
}

fn refract(uv: vec3f,cos_theta: f32, n: vec3f, refraction_indexes_ratio: f32) -> vec3f {
  //Calcula a componente perpendicular do raio refratado: (n/n')*(uv + cos(theta)*n)
  var r_out_perp = refraction_indexes_ratio * (uv + cos_theta * n);
  //Calcula a componente paralela do raio refratado: -sqrt(abs(1.0 - dot(r_out_perp, r_out_perp))) * n
  var r_out_parallel = -sqrt(max(0.0, 1.0 - dot(r_out_perp, r_out_perp))) * n;
  //Retorna a soma das componentes
  return r_out_perp + r_out_parallel;
}

fn schlick(cos_theta: f32, refraction_indexes_ratio: f32) -> f32 {
    let r0 = pow((1.0 - refraction_indexes_ratio) / (1.0 + refraction_indexes_ratio), 2.0);
    return r0 + (1.0 - r0) * pow(1.0 - cos_theta, 5.0);
}



fn lambertian(normal : vec3f, absorption: f32, random_sphere: vec3f, rng_state: ptr<function, u32>) -> material_behaviour{
  // Pega um ponto aleatório na esfera unitária e soma com a normal
  var scattered = normalize(normal + random_sphere);


  return material_behaviour(rng_next_float(rng_state)>absorption, scattered);
}

fn metal(normal : vec3f, direction: vec3f, fuzz: f32, random_sphere: vec3f) -> material_behaviour{
  // Calcula a direção refletida
  var reflected = reflect(direction, normal);
  // Adiciona um fator de suavidade
  var scattered = reflected + fuzz * random_sphere;
  // Se o raio refletido for menor que 0, não houve reflexão
  return material_behaviour(dot(scattered, normal) > 0.0, normalize(scattered));
}

fn dielectric(normal : vec3f, r_direction: vec3f, refraction_index: f32, frontface: bool, random_sphere: vec3f, fuzz: f32, rng_state: ptr<function, u32>) -> material_behaviour{
  //Normaliza a direção do raio
  var unit_direction = normalize(r_direction);
  //Calcula o cosseno do ângulo com o produto escalar entre a direção do raio invertida e a normal
  var cos_theta = min(dot(-unit_direction, normal), 1.0);
  //Calcula o seno do ângulo usando a identidade trigonométrica
  var sin_theta = sqrt(1.0 - cos_theta * cos_theta);
  //Razão entre os índices de refração
  var refraction_indexes_ratio: f32;
  //Checa se o raio está vindo de dentro ou de fora do objeto
  refraction_indexes_ratio = select( refraction_index,1.0 / refraction_index, frontface);
  //Checa se o raio não pode refratar
  var cannot_refract = refraction_indexes_ratio * sin_theta > 1.0;
  var direction: vec3f;
  //Se não pode refratar
  if (cannot_refract || schlick(cos_theta, refraction_indexes_ratio) > rng_next_float(rng_state)){
    //Calcula a reflexão
    direction = reflect(unit_direction, normal);
  }
  else{
    //Calcula a refração
    direction = refract(unit_direction,cos_theta, normal, refraction_indexes_ratio);
  }

  return material_behaviour(true, normalize(direction));
}

fn trace(r: ray, rng_state: ptr<function, u32>) -> vec3f{
  // Pega o número máximo que o raio pode se refletir
  var maxbounces = i32(uniforms[2]);
  // Inicializa a luz
  var light = vec3f(0.0);
  // Inicializa a cor
  var color = vec3f(1.0);
  // Inicializa o raio
  var r_ = r;
  // Pega as cores do ambiente
  var backgroundcolor1 = int_to_rgb(i32(uniforms[11]));
  var backgroundcolor2 = int_to_rgb(i32(uniforms[12]));

  //Shadow Acne Fix
  const epsilon = 0.0001;

  // Inicializa o comportamento do material
  var behaviour = material_behaviour(true, vec3f(0.0));

  for (var j = 0; j < maxbounces; j = j + 1){
      // Checa se o raio atingiu algo
      let current_object = check_ray_collision(r_, RAY_TMAX);
      
      // Se não atingiu nada
      if (!current_object.hit_anything){
          // Se não atingiu nada, pega a cor do ambiente
          light += envoriment_color(r_.direction, backgroundcolor1, backgroundcolor2);
          light *= color;
          break;
      }

      // Se a esfera foi atingida
      let material = current_object.object_material;
      //Pega o parametro de emissão
      let emission = material.w;
      if (emission > 0){ 
        // Aplica a emissao multiplicando pela cor acumulada
        light += color * current_object.object_color.rgb * emission;
        break; 
      }

      // Pega o parâmetro de suavidade
      let smothness = material.x;
      //Pega o parâmetro de absorção
      let absorption = material.y;
      //Pega o parâmetro de reflexão
      let specular = material.z;
      //Rng Vec3 para esfera unitária
      let random_sphere = rng_next_vec3_in_unit_sphere(rng_state);
      //Rng Vec3 para float
      let random_float = rng_next_float(rng_state);

      //Material lambertiano
      if (smothness == 0){
        //Calcula o comportamento do material
        behaviour = lambertian(current_object.normal, absorption, random_sphere, rng_state);
        // Multiplica a cor pela cor do objeto
        color *= current_object.object_color.rgb * (1.0 - absorption);
      } 
      else if (smothness > 0){
        if (random_float < specular){
          //Calcula o comportamento do material metálico
          behaviour = metal(current_object.normal, r_.direction, absorption, random_sphere);

        }
        else{
          behaviour = lambertian(current_object.normal, absorption, random_sphere, rng_state);
          color *= current_object.object_color.rgb * (1.0 - absorption);
        }

      }
      else if (smothness < 0){
        // Calcula o comportamento do material dielétrico
        // Índice de refração
        behaviour = dielectric(
            current_object.normal,
            r_.direction,
            specular,
            current_object.frontface,
            random_sphere,
            absorption,
            rng_state
        );
        //Se bateu por fora apenas soma a normal
        if (current_object.frontface){
          r_= ray(current_object.p + current_object.normal*0.00001, behaviour.direction);
        }
        else{
          //Se bateu por dentro subtrai a normal, uma vez que ela foi invertida
          r_= ray(current_object.p - current_object.normal*0.001, behaviour.direction);
        }
        continue;
      }
      //Checa se o raio foi absorvido 
      if (!behaviour.scatter){
        //Se foi quebramos o loop
        break;
      } 
      //Raio refletido
      r_ = ray(current_object.p + current_object.normal*epsilon, behaviour.direction);
  }
  return light;
}

@compute @workgroup_size(THREAD_COUNT, THREAD_COUNT, 1)
fn render(@builtin(global_invocation_id) id : vec3u){
    var rez = uniforms[1];
    var time = u32(uniforms[0]);

    // init_rng (random number generator) we pass the pixel position, resolution and frame
    var rng_state = init_rng(vec2(id.x, id.y), vec2(u32(rez)), time);

    // Get uv
    var fragCoord = vec2f(f32(id.x), f32(id.y));
    var uv = (fragCoord + sample_square(&rng_state)) / vec2(rez);

    // Camera
    var lookfrom = vec3(uniforms[7], uniforms[8], uniforms[9]);
    // Lookat
    var lookat = vec3(uniforms[23], uniforms[24], uniforms[25]);  
    

    // Get camera
    var cam = get_camera(lookfrom, lookat, vec3(0.0, 1.0, 0.0), uniforms[10], 1.0, uniforms[6], uniforms[5]);
    // Get the number of samples per pixel
    var samples_per_pixel = i32(uniforms[4]);

    var color = vec3f(0.0, 0.0, 0.0);

    // Loopa sobre as amostras
    for (var i = 0; i < samples_per_pixel; i = i + 1) {
        // Pega o raio da amostra atual
        var r = get_ray(cam, uv, &rng_state);

        //Chama a função trace
        var color_sample = trace(r, &rng_state);

        //Acumula a cor de cada amostra
        color += color_sample;
    }

    //Média das cores
    color /= f32(samples_per_pixel);
    // Converte a cor de linear para gamma
    var color_out = vec4(saturate(linear_to_gamma(color)), 1.0);
    // Mapeia o pixel
    var map_fb = mapfb(id.xy, rez);
    // Acumula the color
    var should_accumulate = uniforms[3];
    // Cor anterior
    var previous_color = rtfb[map_fb];
    // Cor acumulada
    var accumulated_color = previous_color * should_accumulate + color_out;
    // Salva a cor acumulada
    rtfb[map_fb] = accumulated_color;
    //Como com cada amostra é aumentado o alfa em 1, dividimos pelo alfa para normalizar
    fb[map_fb] = accumulated_color/accumulated_color.w;
}