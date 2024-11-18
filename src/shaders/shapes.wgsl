struct FaceNormalResult {
    normal: vec3f,
    front_face: bool,
};


fn hit_sphere(center: vec3f, radius: f32, r: ray, record: ptr<function, hit_record>, max: f32){

  // Calcula o vetor que vai do centro da esfera até a origem do raio
  let oc = r.origin - center;
  // Calcula a variável a da equação quadrática  (Direction * Direction)	
  let a = 1.0;
  // Calcula a variável h da equação quadrática  Direction * (Origin - Center)
  let h = dot(oc, r.direction);
  //Calcula a variável c da equação quadrática  (A-C) *(A-C) - R²
  let c = dot(oc, oc) - radius * radius;
  // Calcula o delta da equação quadrática h² - a*c
  let delta = h*h - a*c;
  // Se delta for menor que 0, não houve colisão
  if (delta < 0.0){
    (*record).hit_anything = false;
    return;
  }
  // Calcula a raiz do delta
  let sqrt_delta = sqrt(delta);
  //Raiz atual da equação quadrática
  var current_root = (-h - sqrt_delta) / a;

  // Verifica se a raiz está dentro do intervalo
  if (current_root < RAY_TMIN || current_root > max){
    // Atualiza a raiz atual para a segunda raiz
    current_root = (-h + sqrt_delta) / a;
    // Verifica se a segunda raiz está dentro do intervalo
    if (current_root < RAY_TMIN || current_root > max){
      // Se nenhuma raiz estiver dentro do intervalo, não houve colisão
      (*record).hit_anything = false;
      return;
    }
  }

  // Caso tenha acertado a esfera atualiza o record

  // Atualiza o valor da distância
  (*record).t = current_root;
  // Atualiza o ponto de colisão
  (*record).p = ray_at(r, current_root);
  // Atualiza a normal
  (*record).normal = normalize((*record).p - center);
  // Atualiza a flag de colisão
  (*record).hit_anything = true;
  return;
}


fn hit_quad(r: ray, Q: vec4f, u: vec4f, v: vec4f, record: ptr<function, hit_record>, max: f32)
{
  var n = cross(u.xyz, v.xyz);
  var normal = normalize(n);
  var D = dot(normal, Q.xyz);
  var w = n / dot(n.xyz, n.xyz);

  var denom = dot(normal, r.direction);
  if (abs(denom) < 0.0001)
  {
    record.hit_anything = false;
    return;
  }

  var t = (D - dot(normal, r.origin)) / denom;
  if (t < RAY_TMIN || t > max)
  {
    record.hit_anything = false;
    return;
  }

  var intersection = ray_at(r, t);
  var planar_hitpt_vector = intersection - Q.xyz;
  var alpha = dot(w, cross(planar_hitpt_vector, v.xyz));
  var beta = dot(w, cross(u.xyz, planar_hitpt_vector));

  if (alpha < 0.0 || alpha > 1.0 || beta < 0.0 || beta > 1.0)
  {
    record.hit_anything = false;
    return;
  }

  if (dot(normal, r.direction) > 0.0)
  {
    record.hit_anything = false;
    return;
  }

  record.t = t;
  record.p = intersection;
  record.normal = normal;
  record.hit_anything = true;
}

fn hit_triangle(r: ray, v0: vec3f, v1: vec3f, v2: vec3f, record: ptr<function, hit_record>, max: f32)
{
  var v1v0 = v1 - v0;
  var v2v0 = v2 - v0;
  var rov0 = r.origin - v0;

  var n = cross(v1v0, v2v0);
  var q = cross(rov0, r.direction);

  var d = 1.0 / dot(r.direction, n);

  var u = d * dot(-q, v2v0);
  var v = d * dot(q, v1v0);
  var t = d * dot(-n, rov0);

  if (u < 0.0 || u > 1.0 || v < 0.0 || (u + v) > 1.0)
  {
    record.hit_anything = false;
    return;
  }

  if (t < RAY_TMIN || t > max)
  {
    record.hit_anything = false;
    return;
  }

  record.t = t;
  record.p = ray_at(r, t);
  record.normal = normalize(n);
  record.hit_anything = true;
}

fn hit_box(r: ray, center: vec3f, rad: vec3f, rotation:vec4f,record: ptr<function, hit_record>, t_max: f32)
{
  // Checa se a caixa é um planocircular
  if (rad.x < 0.0) {
    // Normaliza a orientação do plano
    let plane_normal = normalize(rotation.xyz);

    // Denominador do cálculo da interseção
    let denom = dot(plane_normal, r.direction);
    if (abs(denom) < 0.0001) {
      // Ray is parallel to the plane
      (*record).hit_anything = false;
      return;
    }

    // Pontos de interseção com o plano
    let t = dot(center - r.origin, plane_normal) / denom;
    if (t < RAY_TMIN || t > t_max) {
      // Intersecção fora do intervalo	
      (*record).hit_anything = false;
      return;
    }

    // Calcula o ponto de interseção
    let hit_point = ray_at(r, t);

    // Checa se o ponto de interseção está dentro do círculo
    let to_hit = hit_point - center;
    // Calcula o raio do círculo
    let radius = abs(rad.x); 
    if (dot(to_hit, to_hit) > radius * radius) {
      // Fora do círculo
      (*record).hit_anything = false;
      return;
    }

    // Update hit record for circular plane
    (*record).t = t;
    (*record).p = hit_point;
    (*record).normal = plane_normal;
    (*record).hit_anything = true;
    return;
  }

   // Handle box case
  var m = 1.0 / r.direction;
  var n = m * (r.origin - center);
  var k = abs(m) * rad;

  var t1 = -n - k;
  var t2 = -n + k;

  var tN = max(max(t1.x, t1.y), t1.z);
  var tF = min(min(t2.x, t2.y), t2.z);

  if (tN > tF || tF < 0.0) {
    (*record).hit_anything = false;
    return;
  }

  var t = tN;
  if (t < RAY_TMIN || t > t_max) {
    (*record).hit_anything = false;
    return;
  }

  // Update hit record for box
  (*record).t = t;
  (*record).p = ray_at(r, t);
  (*record).normal = -sign(r.direction) * step(t1.yzx, t1.xyz) * step(t1.zxy, t1.xyz);
  (*record).hit_anything = true;

  return;
}
