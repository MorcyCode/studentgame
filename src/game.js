const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const hud = document.getElementById("hud");
const healthBar = document.getElementById("health-bar");
const healthText = document.getElementById("health-text");
const climateText = document.getElementById("climate-text");
const gearText = document.getElementById("gear-text");
const herbCount = document.getElementById("herb-count");
const potionCount = document.getElementById("potion-count");
const cactusCount = document.getElementById("cactus-count");
const penguinCount = document.getElementById("penguin-count");
const placeTitle = document.getElementById("place-title");
const placeSubtitle = document.getElementById("place-subtitle");
const promptBox = document.getElementById("prompt");
const toast = document.getElementById("toast");
const mapButton = document.getElementById("map-button");
const restartButton = document.getElementById("restart-button");

const TAU = Math.PI * 2;
const keys = new Set();
const pointer = { x: 0, y: 0 };

let dpr = 1;
let width = 0;
let height = 0;
let lastTime = performance.now();
let toastTimer = 0;
let weatherPulse = 0;

const player = {
  x: 0,
  y: 0,
  radius: 16,
  speed: 235,
  health: 100,
  maxHealth: 100,
  invulnerable: 0,
  direction: 0,
  inventory: {
    herbs: 0,
    potions: 0,
    cactusHide: 0,
    penguinHide: 0,
  },
  gear: {
    cactusSuit: false,
    warmCoat: false,
  },
};

const state = {
  mode: "map",
  location: null,
  biome: null,
  world: null,
  mapHotspots: [],
  entities: [],
  particles: [],
  camera: { x: 0, y: 0 },
  actionTarget: null,
  gameOver: false,
};

const biomeCatalog = {
  equatorJungle: {
    name: "赤道雨林",
    colors: ["#145c3d", "#1f7d4b", "#2d9a61", "#5a3b22"],
    ground: "#153c2d",
    accent: "#75c66d",
    feature: "榕树根、藤蔓和潮湿蕨类",
    plant: "金鸡纳藤",
    plantColor: "#9adf78",
    plantNeed: 2,
    enemy: "美洲豹",
    enemyColor: "#c99647",
    enemySpeed: 104,
    enemyDamage: 13,
    enemyHealth: 38,
    animalDrops: null,
    heatRisk: true,
    coldRisk: false,
    landmark: "闷热树冠",
  },
  desert: {
    name: "热带沙漠",
    colors: ["#b88745", "#d1aa62", "#8d6a3c", "#376c50"],
    ground: "#9f793d",
    accent: "#d9bd72",
    feature: "沙丘、风蚀岩和柱状仙人掌",
    plant: "仙人掌",
    plantColor: "#3f9c65",
    plantNeed: 2,
    enemy: "毒蝎",
    enemyColor: "#50312c",
    enemySpeed: 94,
    enemyDamage: 10,
    enemyHealth: 24,
    animalDrops: null,
    cactusBiome: true,
    heatRisk: true,
    coldRisk: false,
    landmark: "滚烫沙海",
  },
  savanna: {
    name: "非洲稀树草原",
    colors: ["#a88a47", "#c7aa5b", "#628b4a", "#9d5e3b"],
    ground: "#876f39",
    accent: "#d7bc68",
    feature: "金色草场、猴面包树和芦荟",
    plant: "芦荟",
    plantColor: "#71b465",
    plantNeed: 2,
    enemy: "狮子",
    enemyColor: "#c79a46",
    enemySpeed: 121,
    enemyDamage: 15,
    enemyHealth: 46,
    animalDrops: null,
    heatRisk: false,
    coldRisk: false,
    landmark: "开阔草场",
  },
  temperate: {
    name: "温带森林",
    colors: ["#214a36", "#4c7b46", "#6b8d52", "#6a4b35"],
    ground: "#1d3329",
    accent: "#91bf77",
    feature: "针阔混交林、浆果丛和溪谷",
    plant: "野山参",
    plantColor: "#e3d48c",
    plantNeed: 2,
    enemy: "灰狼",
    enemyColor: "#8a938e",
    enemySpeed: 112,
    enemyDamage: 12,
    enemyHealth: 36,
    animalDrops: null,
    heatRisk: false,
    coldRisk: false,
    landmark: "苔藓林地",
  },
  tundra: {
    name: "寒带苔原",
    colors: ["#d9eef1", "#a8c9cf", "#647a83", "#7b8e69"],
    ground: "#b7d5da",
    accent: "#eef8f9",
    feature: "冻土、矮灌木和远处冰脊",
    plant: "雪地地衣",
    plantColor: "#d5e9b8",
    plantNeed: 2,
    enemy: "北极狼",
    enemyColor: "#e2e7e6",
    enemySpeed: 116,
    enemyDamage: 14,
    enemyHealth: 42,
    animalDrops: null,
    heatRisk: false,
    coldRisk: true,
    landmark: "寒风冻原",
  },
  polar: {
    name: "极地冰原",
    colors: ["#f2fbff", "#b5dbe8", "#82aabd", "#1f3341"],
    ground: "#cce9f0",
    accent: "#ffffff",
    feature: "浮冰、雪坡和企鹅栖息地",
    plant: "极地苔藓",
    plantColor: "#c9e9a8",
    plantNeed: 2,
    enemy: "豹海豹",
    enemyColor: "#526675",
    enemySpeed: 105,
    enemyDamage: 16,
    enemyHealth: 50,
    animalDrops: null,
    secondaryEnemy: "帝企鹅守卫",
    secondaryColor: "#20272b",
    secondaryDrop: "penguinHide",
    heatRisk: false,
    coldRisk: true,
    penguinBiome: true,
    landmark: "极昼冰面",
  },
  mountain: {
    name: "高山雪线",
    colors: ["#b8c5c5", "#eef5f3", "#6e7d7c", "#4d5e4c"],
    ground: "#768584",
    accent: "#e7f3ef",
    feature: "碎石坡、雪线和高山草甸",
    plant: "雪莲",
    plantColor: "#f2f1c0",
    plantNeed: 2,
    enemy: "雪豹",
    enemyColor: "#d2d4ce",
    enemySpeed: 123,
    enemyDamage: 15,
    enemyHealth: 44,
    animalDrops: null,
    heatRisk: false,
    coldRisk: true,
    landmark: "稀薄山风",
  },
  island: {
    name: "海岛与远洋",
    colors: ["#1f7f88", "#4fb3b2", "#d7c278", "#34774f"],
    ground: "#257986",
    accent: "#d9c782",
    feature: "礁石、椰林、潮池和海藻带",
    plant: "海藻",
    plantColor: "#62be76",
    plantNeed: 2,
    enemy: "礁鲨",
    enemyColor: "#667f90",
    enemySpeed: 115,
    enemyDamage: 13,
    enemyHealth: 40,
    animalDrops: null,
    heatRisk: false,
    coldRisk: false,
    landmark: "珊瑚浅滩",
  },
};

const mapLandmasses = [
  {
    name: "北美洲",
    color: "#3f7d52",
    points: [
      [-168, 70],
      [-128, 74],
      [-92, 62],
      [-63, 48],
      [-81, 28],
      [-98, 15],
      [-121, 28],
      [-144, 45],
    ],
  },
  {
    name: "南美洲",
    color: "#388b55",
    points: [
      [-82, 12],
      [-48, 8],
      [-35, -16],
      [-51, -55],
      [-70, -52],
      [-78, -20],
    ],
  },
  {
    name: "欧亚大陆",
    color: "#4d8753",
    points: [
      [-10, 71],
      [35, 73],
      [103, 68],
      [168, 56],
      [151, 25],
      [106, 8],
      [68, 20],
      [38, 8],
      [10, 34],
      [-9, 36],
      [-25, 55],
    ],
  },
  {
    name: "非洲",
    color: "#8a9150",
    points: [
      [-18, 34],
      [32, 33],
      [51, 10],
      [42, -34],
      [18, -36],
      [-5, -24],
      [-18, 5],
    ],
  },
  {
    name: "澳大利亚",
    color: "#9b7f43",
    points: [
      [111, -12],
      [154, -12],
      [153, -39],
      [121, -44],
      [111, -30],
    ],
  },
  {
    name: "格陵兰",
    color: "#bed5da",
    points: [
      [-52, 82],
      [-20, 75],
      [-28, 61],
      [-55, 59],
      [-73, 70],
    ],
  },
  {
    name: "南极洲",
    color: "#e7f3f5",
    points: [
      [-180, -70],
      [-120, -77],
      [-30, -72],
      [55, -78],
      [140, -72],
      [180, -75],
      [180, -88],
      [-180, -88],
    ],
  },
];

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function lonLatToMap(lon, lat) {
  const marginX = Math.max(42, width * 0.08);
  const marginY = Math.max(76, height * 0.14);
  const mapW = width - marginX * 2;
  const mapH = height - marginY * 2;
  return {
    x: marginX + ((lon + 180) / 360) * mapW,
    y: marginY + ((85 - lat) / 170) * mapH,
  };
}

function screenToLonLat(x, y) {
  const marginX = Math.max(42, width * 0.08);
  const marginY = Math.max(76, height * 0.14);
  const mapW = width - marginX * 2;
  const mapH = height - marginY * 2;
  const lon = clamp(((x - marginX) / mapW) * 360 - 180, -180, 180);
  const lat = clamp(85 - ((y - marginY) / mapH) * 170, -85, 85);
  return { lon, lat };
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lon < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function isLand(lonLat) {
  return mapLandmasses.some((land) => pointInPolygon(lonLat, land.points));
}

function chooseBiome({ lon, lat }) {
  const absLat = Math.abs(lat);
  const land = isLand({ lon, lat });

  if (!land) {
    if (absLat > 62) return biomeCatalog.polar;
    return biomeCatalog.island;
  }
  if (lat < -68 || lat > 72) return biomeCatalog.polar;
  if (absLat > 58) return biomeCatalog.tundra;
  if ((lon > 64 && lon < 96 && lat > 27 && lat < 39) || (lon > -78 && lon < -66 && lat < -14 && lat > -32)) {
    return biomeCatalog.mountain;
  }
  if (
    (lon > -17 && lon < 58 && lat > 9 && lat < 33) ||
    (lon > 112 && lon < 150 && lat < -17 && lat > -35) ||
    (lon > -75 && lon < -66 && lat < -16 && lat > -29)
  ) {
    return biomeCatalog.desert;
  }
  if (absLat < 12) {
    if (lon > -82 && lon < -48) return biomeCatalog.equatorJungle;
    if (lon > 15 && lon < 42) return biomeCatalog.savanna;
    if (lon > 95 && lon < 145) return biomeCatalog.equatorJungle;
    return biomeCatalog.equatorJungle;
  }
  if (lon > -20 && lon < 45 && lat < 2 && lat > -32) return biomeCatalog.savanna;
  if (absLat > 42) return biomeCatalog.temperate;
  return biomeCatalog.temperate;
}

function describeLocation(lonLat, biome) {
  const ns = lonLat.lat >= 0 ? "北纬" : "南纬";
  const ew = lonLat.lon >= 0 ? "东经" : "西经";
  return `${ns}${Math.abs(lonLat.lat).toFixed(1)}° ${ew}${Math.abs(lonLat.lon).toFixed(1)}° · ${biome.name}`;
}

function resetPlayerForTrip() {
  player.x = 1200;
  player.y = 800;
  player.direction = 0;
  player.invulnerable = 0;
}

function createWorld(lonLat, biome) {
  const world = {
    width: 2400,
    height: 1600,
    seed: Math.floor((lonLat.lon + 180) * 31 + (lonLat.lat + 90) * 71),
  };
  const entities = [];
  const random = seededRandom(world.seed);

  for (let i = 0; i < 30; i += 1) {
    entities.push({
      kind: "plant",
      x: 150 + random() * (world.width - 300),
      y: 120 + random() * (world.height - 240),
      radius: 15,
      name: biome.plant,
      color: biome.plantColor,
      collected: false,
      sway: random() * TAU,
    });
  }

  const enemyCount = biome.secondaryEnemy ? 5 : 7;
  for (let i = 0; i < enemyCount; i += 1) {
    entities.push(createEnemy(biome, random, false, world));
  }
  if (biome.secondaryEnemy) {
    for (let i = 0; i < 4; i += 1) {
      entities.push(createEnemy(biome, random, true, world));
    }
  }

  for (let i = 0; i < 48; i += 1) {
    entities.push({
      kind: "prop",
      x: 80 + random() * (world.width - 160),
      y: 80 + random() * (world.height - 160),
      radius: 12 + random() * 26,
      color: biome.colors[Math.floor(random() * biome.colors.length)],
      variant: Math.floor(random() * 4),
      sway: random() * TAU,
    });
  }

  return { world, entities };
}

function seededRandom(seed) {
  let t = seed + 0x6d2b79f5;
  return function next() {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function createEnemy(biome, random, secondary, world) {
  const isPenguin = Boolean(secondary);
  return {
    kind: "enemy",
    x: 180 + random() * (world.width - 360),
    y: 150 + random() * (world.height - 300),
    radius: isPenguin ? 18 : 22,
    name: isPenguin ? biome.secondaryEnemy : biome.enemy,
    color: isPenguin ? biome.secondaryColor : biome.enemyColor,
    speed: (isPenguin ? 72 : biome.enemySpeed) + random() * 16,
    damage: isPenguin ? 8 : biome.enemyDamage,
    health: isPenguin ? 18 : biome.enemyHealth,
    maxHealth: isPenguin ? 18 : biome.enemyHealth,
    drop: isPenguin ? biome.secondaryDrop : biome.animalDrops,
    attackCooldown: 0,
    wander: random() * TAU,
    wanderClock: random() * 4,
    defeated: false,
  };
}

function startTrip(lonLat) {
  const biome = chooseBiome(lonLat);
  const generated = createWorld(lonLat, biome);
  state.mode = "explore";
  state.location = {
    lon: lonLat.lon,
    lat: lonLat.lat,
    title: describeLocation(lonLat, biome),
  };
  state.biome = biome;
  state.world = generated.world;
  state.entities = generated.entities;
  state.particles = [];
  state.actionTarget = null;
  state.gameOver = false;
  resetPlayerForTrip();
  showToast(`穿越到${biome.name}：${biome.feature}`);
  updateHud();
}

function returnToMap() {
  state.mode = "map";
  state.actionTarget = null;
  state.location = null;
  state.biome = null;
  state.world = null;
  state.entities = [];
  state.particles = [];
  updateHud();
}

function restartGame() {
  player.health = player.maxHealth;
  player.inventory.herbs = 0;
  player.inventory.potions = 0;
  player.inventory.cactusHide = 0;
  player.inventory.penguinHide = 0;
  player.gear.cactusSuit = false;
  player.gear.warmCoat = false;
  returnToMap();
  showToast("新的旅程开始了");
}

function update(dt) {
  weatherPulse += dt;
  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0) {
      toast.classList.remove("is-visible");
    }
  }

  if (state.mode !== "explore" || state.gameOver) {
    return;
  }

  player.invulnerable = Math.max(0, player.invulnerable - dt);
  updatePlayer(dt);
  updateEntities(dt);
  updateParticles(dt);
  applyClimate(dt);
  findActionTarget();
  updateCamera();
}

function updatePlayer(dt) {
  let dx = 0;
  let dy = 0;
  if (keys.has("w")) dy -= 1;
  if (keys.has("s")) dy += 1;
  if (keys.has("a")) dx -= 1;
  if (keys.has("d")) dx += 1;

  if (dx || dy) {
    const mag = Math.hypot(dx, dy);
    dx /= mag;
    dy /= mag;
    player.x += dx * player.speed * dt;
    player.y += dy * player.speed * dt;
    player.direction = Math.atan2(dy, dx);
  }

  player.x = clamp(player.x, player.radius, state.world.width - player.radius);
  player.y = clamp(player.y, player.radius, state.world.height - player.radius);
}

function updateEntities(dt) {
  for (const entity of state.entities) {
    if (entity.kind !== "enemy" || entity.defeated) continue;

    entity.attackCooldown = Math.max(0, entity.attackCooldown - dt);
    const toPlayer = Math.hypot(player.x - entity.x, player.y - entity.y);
    if (toPlayer < 360) {
      const angle = Math.atan2(player.y - entity.y, player.x - entity.x);
      entity.x += Math.cos(angle) * entity.speed * dt;
      entity.y += Math.sin(angle) * entity.speed * dt;
      entity.wander = angle;
    } else {
      entity.wanderClock -= dt;
      if (entity.wanderClock <= 0) {
        entity.wander += (Math.random() - 0.5) * 1.5;
        entity.wanderClock = 1.5 + Math.random() * 2.2;
      }
      entity.x += Math.cos(entity.wander) * entity.speed * 0.18 * dt;
      entity.y += Math.sin(entity.wander) * entity.speed * 0.18 * dt;
    }

    entity.x = clamp(entity.x, entity.radius, state.world.width - entity.radius);
    entity.y = clamp(entity.y, entity.radius, state.world.height - entity.radius);

    if (toPlayer < entity.radius + player.radius + 4 && entity.attackCooldown <= 0) {
      damagePlayer(entity.damage, `${entity.name}咬伤了你`);
      entity.attackCooldown = 1.1;
      knockback(entity, player, 42);
    }
  }
}

function updateParticles(dt) {
  for (const particle of state.particles) {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function applyClimate(dt) {
  const biome = state.biome;
  if (!biome) return;

  const onEquator = Math.abs(state.location.lat) < 10;
  const heatActive = (biome.heatRisk || onEquator) && !player.gear.cactusSuit;
  const coldActive = biome.coldRisk && !player.gear.warmCoat;

  if (heatActive) {
    damagePlayer(4.2 * dt, "高温正在灼伤你", true);
  }
  if (coldActive) {
    damagePlayer(3.8 * dt, "严寒正在消耗体力", true);
  }
}

function damagePlayer(amount, reason, climateDamage = false) {
  if (!climateDamage && player.invulnerable > 0) return;
  player.health = clamp(player.health - amount, 0, player.maxHealth);
  if (!climateDamage) {
    player.invulnerable = 0.65;
    showToast(reason);
  }
  if (player.health <= 0 && !state.gameOver) {
    state.gameOver = true;
    showToast("体力耗尽，按重新开始返回世界地图");
  }
}

function healPlayer(amount) {
  player.health = clamp(player.health + amount, 0, player.maxHealth);
}

function knockback(source, target, power) {
  const angle = Math.atan2(target.y - source.y, target.x - source.x);
  target.x = clamp(target.x + Math.cos(angle) * power, player.radius, state.world.width - player.radius);
  target.y = clamp(target.y + Math.sin(angle) * power, player.radius, state.world.height - player.radius);
}

function findActionTarget() {
  let best = null;
  let bestDist = Infinity;
  for (const entity of state.entities) {
    if (entity.collected || entity.defeated) continue;
    if (entity.kind !== "plant" && entity.kind !== "enemy") continue;
    const dist = distance(player, entity);
    if (dist < 64 && dist < bestDist) {
      best = entity;
      bestDist = dist;
    }
  }
  state.actionTarget = best;
}

function interact() {
  if (state.mode !== "explore" || state.gameOver) return;
  const target = state.actionTarget;
  if (!target) return;

  if (target.kind === "plant") {
    gatherPlant(target);
  } else if (target.kind === "enemy") {
    strikeEnemy(target);
  }
}

function gatherPlant(plant) {
  plant.collected = true;
  player.inventory.herbs += 1;
  if (state.biome.cactusBiome) {
    player.inventory.cactusHide += 1;
    showToast(`采到${plant.name}：药材 +1，仙人掌皮 +1`);
  } else {
    showToast(`采到${plant.name}：药材 +1`);
  }
  burst(plant.x, plant.y, plant.color, 12);
}

function strikeEnemy(enemy) {
  enemy.health -= 22;
  knockback(player, enemy, 38);
  burst(enemy.x, enemy.y, "#f0e4c1", 7);
  if (enemy.health <= 0) {
    enemy.defeated = true;
    if (enemy.drop === "penguinHide") {
      player.inventory.penguinHide += 1;
      showToast(`击退${enemy.name}：企鹅皮 +1`);
    } else {
      const herbBonus = Math.random() > 0.5 ? 1 : 0;
      player.inventory.herbs += herbBonus;
      showToast(herbBonus ? `击退${enemy.name}，找到可用药材` : `击退${enemy.name}`);
    }
  } else {
    showToast(`攻击${enemy.name}`);
  }
}

function craft() {
  if (state.mode !== "explore" || state.gameOver) return;

  if (!player.gear.cactusSuit && player.inventory.cactusHide >= 3) {
    player.inventory.cactusHide -= 3;
    player.gear.cactusSuit = true;
    showToast("做成仙人掌吉利服：免疫赤道和沙漠过热");
    return;
  }

  if (!player.gear.warmCoat && player.inventory.penguinHide >= 2) {
    player.inventory.penguinHide -= 2;
    player.gear.warmCoat = true;
    showToast("做成企鹅皮保暖衣：免疫极寒");
    return;
  }

  if (player.inventory.herbs >= state.biome.plantNeed) {
    player.inventory.herbs -= state.biome.plantNeed;
    player.inventory.potions += 1;
    showToast(`${state.biome.plant}制成回血药`);
    return;
  }

  showToast("材料不足");
}

function usePotion() {
  if (player.inventory.potions <= 0 || state.gameOver) return;
  player.inventory.potions -= 1;
  healPlayer(36);
  burst(player.x, player.y, "#78c66f", 16);
  showToast("喝下回血药");
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * TAU;
    const speed = 35 + Math.random() * 80;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      life: 0.38 + Math.random() * 0.36,
      size: 2 + Math.random() * 4,
    });
  }
}

function updateCamera() {
  const maxX = Math.max(0, state.world.width - width);
  const maxY = Math.max(0, state.world.height - height);
  state.camera.x = clamp(player.x - width / 2, 0, maxX);
  state.camera.y = clamp(player.y - height / 2, 0, maxY);
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  if (state.mode === "map") {
    drawWorldMap();
  } else {
    drawExpedition();
  }
  updateHud();
}

function drawWorldMap() {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#071822");
  sky.addColorStop(0.5, "#12344a");
  sky.addColorStop(1, "#07120f");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  drawStars();
  drawMapOcean();
  drawLatitudeBands();
  drawLandmasses();
  drawMapHotspots();
  drawMapLabels();
}

function drawStars() {
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = "#eef7e8";
  for (let i = 0; i < 80; i += 1) {
    const x = (i * 97) % width;
    const y = (i * 53) % Math.max(height * 0.35, 1);
    ctx.fillRect(x, y, 1.2, 1.2);
  }
  ctx.restore();
}

function drawMapOcean() {
  const marginX = Math.max(42, width * 0.08);
  const marginY = Math.max(76, height * 0.14);
  const mapW = width - marginX * 2;
  const mapH = height - marginY * 2;

  ctx.save();
  roundRect(marginX, marginY, mapW, mapH, 8);
  ctx.clip();

  const ocean = ctx.createLinearGradient(0, marginY, 0, marginY + mapH);
  ocean.addColorStop(0, "#17495f");
  ocean.addColorStop(0.48, "#2d7890");
  ocean.addColorStop(1, "#123b54");
  ctx.fillStyle = ocean;
  ctx.fillRect(marginX, marginY, mapW, mapH);

  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#e8f7ff";
  ctx.lineWidth = 1;
  for (let i = 0; i < 18; i += 1) {
    const y = marginY + ((i + 0.5) / 18) * mapH;
    ctx.beginPath();
    for (let x = marginX; x <= marginX + mapW; x += 16) {
      const wave = Math.sin(x * 0.017 + i * 0.9 + weatherPulse) * 7;
      if (x === marginX) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(238, 247, 232, 0.28)";
  ctx.lineWidth = 1;
  roundRect(marginX, marginY, mapW, mapH, 8);
  ctx.stroke();
}

function drawLatitudeBands() {
  const bands = [
    { lat: 66.5, color: "rgba(168, 222, 242, 0.28)", label: "极寒" },
    { lat: 10, color: "rgba(239, 109, 95, 0.22)", label: "赤道高温" },
    { lat: -10, color: "rgba(239, 109, 95, 0.22)", label: "" },
    { lat: -66.5, color: "rgba(168, 222, 242, 0.28)", label: "极寒" },
  ];
  const marginX = Math.max(42, width * 0.08);
  const marginY = Math.max(76, height * 0.14);
  const mapW = width - marginX * 2;
  const mapH = height - marginY * 2;

  ctx.save();
  roundRect(marginX, marginY, mapW, mapH, 8);
  ctx.clip();
  for (const band of bands) {
    const p = lonLatToMap(0, band.lat);
    ctx.strokeStyle = band.color;
    ctx.lineWidth = band.lat === 10 || band.lat === -10 ? 28 : 18;
    ctx.beginPath();
    ctx.moveTo(marginX, p.y);
    ctx.lineTo(marginX + mapW, p.y);
    ctx.stroke();
    if (band.label && width > 720) {
      ctx.fillStyle = "rgba(238, 247, 232, 0.62)";
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText(band.label, marginX + 12, p.y - 9);
    }
  }
  ctx.restore();
}

function drawLandmasses() {
  for (const land of mapLandmasses) {
    ctx.beginPath();
    land.points.forEach(([lon, lat], index) => {
      const p = lonLatToMap(lon, lat);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = land.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(10, 28, 19, 0.62)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawDesertPatch(-2, 24, 52, 18);
  drawDesertPatch(132, -24, 35, 18);
  drawDesertPatch(-71, -23, 18, 8);
  drawJunglePatch(-62, -4, 32, 20);
  drawJunglePatch(112, 0, 38, 16);
}

function drawPatch(lon, lat, wLon, hLat, color) {
  const p = lonLatToMap(lon, lat);
  const p2 = lonLatToMap(lon + wLon, lat - hLat);
  ctx.save();
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, Math.abs(p2.x - p.x), Math.abs(p2.y - p.y), -0.15, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawDesertPatch(lon, lat, wLon, hLat) {
  drawPatch(lon, lat, wLon, hLat, "#c4964a");
}

function drawJunglePatch(lon, lat, wLon, hLat) {
  drawPatch(lon, lat, wLon, hLat, "#1e9d58");
}

function drawMapHotspots() {
  const hotspotDefs = [
    { lon: -62, lat: -4, color: "#78c66f" },
    { lon: 12, lat: 22, color: "#e8b45d" },
    { lon: 24, lat: -8, color: "#d7bc68" },
    { lon: 80, lat: 32, color: "#eef7e8" },
    { lon: 135, lat: -24, color: "#e8b45d" },
    { lon: 0, lat: -76, color: "#a8def2" },
    { lon: -145, lat: 64, color: "#a8def2" },
  ];
  state.mapHotspots = hotspotDefs.map((spot) => ({ ...spot, ...lonLatToMap(spot.lon, spot.lat) }));

  for (const spot of state.mapHotspots) {
    const pulse = 5 + Math.sin(weatherPulse * 2 + spot.lon) * 2;
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = spot.color;
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, 17 + pulse, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = spot.color;
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, 5, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

function drawMapLabels() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#eef7e8";
  ctx.font = `700 ${clamp(width * 0.032, 24, 44)}px system-ui, sans-serif`;
  ctx.fillText("世界穿越生存", width / 2, Math.max(42, height * 0.085));
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = "rgba(238, 247, 232, 0.72)";
  ctx.fillText("点击地图任意地点开始旅程", width / 2, Math.max(68, height * 0.085 + 26));

  const mouse = screenToLonLat(pointer.x, pointer.y);
  const biome = chooseBiome(mouse);
  ctx.font = "13px system-ui, sans-serif";
  ctx.fillStyle = "rgba(238, 247, 232, 0.72)";
  ctx.fillText(describeLocation(mouse, biome), width / 2, height - 28);
  ctx.restore();
}

function drawExpedition() {
  const biome = state.biome;
  drawGround(biome);

  const cam = state.camera;
  ctx.save();
  ctx.translate(-cam.x, -cam.y);
  drawWorldDecor(biome);
  drawEntities();
  drawPlayer();
  drawParticles();
  ctx.restore();

  drawVignette();
  if (state.gameOver) {
    drawGameOver();
  }
}

function drawGround(biome) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, biome.ground);
  gradient.addColorStop(1, biome.colors[1] || biome.ground);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  const offsetX = -(state.camera.x % 80);
  const offsetY = -(state.camera.y % 80);
  for (let x = offsetX; x < width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + Math.sin((x + weatherPulse) * 0.01) * 18, height);
    ctx.stroke();
  }
  for (let y = offsetY; y < height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + Math.cos((y + weatherPulse) * 0.01) * 18);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWorldDecor(biome) {
  if (!state.world) return;
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  for (let x = 0; x < state.world.width; x += 220) {
    for (let y = 0; y < state.world.height; y += 180) {
      const r = 28 + ((x + y) % 70);
      ctx.beginPath();
      ctx.ellipse(x + 60, y + 40, r, r * 0.42, ((x + y) % 5) * 0.3, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();

  for (const entity of state.entities) {
    if (entity.kind === "prop") drawProp(entity, biome);
  }
}

function drawProp(prop, biome) {
  ctx.save();
  ctx.translate(prop.x, prop.y);
  const sway = Math.sin(weatherPulse * 1.8 + prop.sway) * 0.05;
  ctx.rotate(sway);

  if (biome === biomeCatalog.desert) {
    ctx.strokeStyle = prop.color;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, prop.radius);
    ctx.lineTo(0, -prop.radius);
    ctx.moveTo(0, -prop.radius * 0.15);
    ctx.lineTo(-prop.radius * 0.6, -prop.radius * 0.55);
    ctx.moveTo(0, -prop.radius * 0.3);
    ctx.lineTo(prop.radius * 0.55, -prop.radius * 0.7);
    ctx.stroke();
  } else if (biome.coldRisk) {
    ctx.fillStyle = prop.color;
    ctx.beginPath();
    ctx.moveTo(0, -prop.radius);
    ctx.lineTo(prop.radius, prop.radius * 0.7);
    ctx.lineTo(-prop.radius, prop.radius * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillRect(-prop.radius * 0.75, -prop.radius * 0.15, prop.radius * 1.5, prop.radius * 0.22);
  } else if (biome === biomeCatalog.island) {
    ctx.fillStyle = "#d7c278";
    ctx.beginPath();
    ctx.ellipse(0, prop.radius * 0.2, prop.radius * 1.2, prop.radius * 0.55, 0.2, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#6b4f31";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, prop.radius * 0.4);
    ctx.quadraticCurveTo(prop.radius * 0.25, -prop.radius * 0.5, 0, -prop.radius);
    ctx.stroke();
    ctx.fillStyle = "#3f8a55";
    for (let i = 0; i < 4; i += 1) {
      ctx.rotate(TAU / 4);
      ctx.beginPath();
      ctx.ellipse(0, -prop.radius, prop.radius * 0.35, prop.radius, 0.4, 0, TAU);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = "#3e2b1e";
    ctx.fillRect(-prop.radius * 0.14, -prop.radius * 0.2, prop.radius * 0.28, prop.radius * 1.15);
    ctx.fillStyle = prop.color;
    ctx.beginPath();
    ctx.arc(0, -prop.radius * 0.55, prop.radius, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawEntities() {
  const entities = [...state.entities].sort((a, b) => a.y - b.y);
  for (const entity of entities) {
    if (entity.kind === "plant" && !entity.collected) drawPlant(entity);
    if (entity.kind === "enemy" && !entity.defeated) drawEnemy(entity);
  }
}

function drawPlant(plant) {
  ctx.save();
  ctx.translate(plant.x, plant.y);
  ctx.rotate(Math.sin(weatherPulse * 2 + plant.sway) * 0.08);
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, plant.radius * 0.85, plant.radius, plant.radius * 0.35, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = plant.color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, plant.radius * 0.6);
    ctx.quadraticCurveTo(i * plant.radius * 0.65, 0, i * plant.radius * 0.4, -plant.radius);
    ctx.stroke();
  }
  ctx.fillStyle = plant.color;
  ctx.beginPath();
  ctx.arc(0, -plant.radius * 0.95, plant.radius * 0.38, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  const angle = enemy.wander || 0;
  ctx.rotate(angle);
  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.beginPath();
  ctx.ellipse(0, enemy.radius * 0.75, enemy.radius * 1.05, enemy.radius * 0.35, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = enemy.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, enemy.radius * 1.08, enemy.radius * 0.72, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = brighten(enemy.color, 26);
  ctx.beginPath();
  ctx.arc(enemy.radius * 0.72, -enemy.radius * 0.08, enemy.radius * 0.45, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(enemy.radius * 0.88, -enemy.radius * 0.18, 2.2, 0, TAU);
  ctx.fill();

  if (enemy.name.includes("企鹅")) {
    ctx.fillStyle = "#f2f4e9";
    ctx.beginPath();
    ctx.ellipse(2, 2, enemy.radius * 0.5, enemy.radius * 0.68, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#e8a23f";
    ctx.beginPath();
    ctx.moveTo(enemy.radius * 1.16, -2);
    ctx.lineTo(enemy.radius * 1.48, 2);
    ctx.lineTo(enemy.radius * 1.16, 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.rotate(-angle);
  const barW = enemy.radius * 1.7;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(-barW / 2, -enemy.radius - 14, barW, 4);
  ctx.fillStyle = "#ef6d5f";
  ctx.fillRect(-barW / 2, -enemy.radius - 14, barW * (enemy.health / enemy.maxHealth), 4);
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  const flicker = player.invulnerable > 0 && Math.floor(weatherPulse * 18) % 2 === 0;
  ctx.globalAlpha = flicker ? 0.55 : 1;

  ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
  ctx.beginPath();
  ctx.ellipse(0, 18, 18, 8, 0, 0, TAU);
  ctx.fill();

  ctx.rotate(player.direction);
  ctx.fillStyle = player.gear.warmCoat ? "#dfe7e9" : player.gear.cactusSuit ? "#4f8c61" : "#2f5d78";
  ctx.beginPath();
  ctx.arc(0, 0, player.radius, 0, TAU);
  ctx.fill();
  ctx.fillStyle = player.gear.cactusSuit ? "#b7df92" : player.gear.warmCoat ? "#2b3438" : "#f0c18b";
  ctx.beginPath();
  ctx.arc(9, -4, 7, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#eef7e8";
  ctx.beginPath();
  ctx.moveTo(player.radius + 12, 0);
  ctx.lineTo(player.radius + 2, -5);
  ctx.lineTo(player.radius + 2, 5);
  ctx.closePath();
  ctx.fill();

  if (player.gear.cactusSuit) {
    ctx.strokeStyle = "#cce8a1";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-10 + i * 4, -15);
      ctx.lineTo(-14 + i * 5, -22);
      ctx.stroke();
    }
  }
  if (player.gear.warmCoat) {
    ctx.strokeStyle = "#a8def2";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 4, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles() {
  for (const particle of state.particles) {
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / 0.6, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

function drawVignette() {
  const hot = state.biome && (state.biome.heatRisk || Math.abs(state.location.lat) < 10) && !player.gear.cactusSuit;
  const cold = state.biome && state.biome.coldRisk && !player.gear.warmCoat;
  if (!hot && !cold) return;

  ctx.save();
  const alpha = 0.16 + Math.sin(weatherPulse * 5) * 0.04;
  ctx.strokeStyle = hot ? `rgba(239, 109, 95, ${alpha})` : `rgba(168, 222, 242, ${alpha})`;
  ctx.lineWidth = Math.max(16, width * 0.025);
  ctx.strokeRect(0, 0, width, height);
  ctx.restore();
}

function drawGameOver() {
  ctx.save();
  ctx.fillStyle = "rgba(4, 8, 7, 0.58)";
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.fillStyle = "#eef7e8";
  ctx.font = "700 34px system-ui, sans-serif";
  ctx.fillText("旅程结束", width / 2, height / 2 - 12);
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillStyle = "rgba(238, 247, 232, 0.74)";
  ctx.fillText("按右上角重新开始", width / 2, height / 2 + 24);
  ctx.restore();
}

function brighten(hex, amount) {
  const raw = hex.replace("#", "");
  const num = parseInt(raw, 16);
  const r = clamp((num >> 16) + amount, 0, 255);
  const g = clamp(((num >> 8) & 255) + amount, 0, 255);
  const b = clamp((num & 255) + amount, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function updateHud() {
  hud.classList.toggle("is-map", state.mode === "map");
  healthBar.style.width = `${player.health}%`;
  healthText.textContent = `${Math.ceil(player.health)}`;
  herbCount.textContent = player.inventory.herbs;
  potionCount.textContent = player.inventory.potions;
  cactusCount.textContent = player.inventory.cactusHide;
  penguinCount.textContent = player.inventory.penguinHide;

  const gear = [];
  if (player.gear.cactusSuit) gear.push("仙人掌吉利服");
  if (player.gear.warmCoat) gear.push("企鹅皮保暖衣");
  gearText.textContent = gear.length ? gear.join(" · ") : "普通衣物";

  if (state.mode === "map") {
    climateText.textContent = "世界地图";
    climateText.className = "chip neutral";
    placeTitle.textContent = "点击世界地图任意地点";
    placeSubtitle.textContent = "选择穿越目的地";
    setPrompt("");
    return;
  }

  const biome = state.biome;
  const heat = (biome.heatRisk || Math.abs(state.location.lat) < 10) && !player.gear.cactusSuit;
  const cold = biome.coldRisk && !player.gear.warmCoat;
  if (heat) {
    climateText.textContent = "过热掉血";
    climateText.className = "chip hot";
  } else if (cold) {
    climateText.textContent = "严寒掉血";
    climateText.className = "chip cold";
  } else {
    climateText.textContent = "稳定";
    climateText.className = "chip safe";
  }

  placeTitle.textContent = state.location.title;
  placeSubtitle.textContent = `${biome.landmark} · ${biome.feature}`;

  if (state.gameOver) {
    setPrompt("");
  } else if (state.actionTarget?.kind === "plant") {
    setPrompt(`E 采集 ${state.actionTarget.name}`);
  } else if (state.actionTarget?.kind === "enemy") {
    setPrompt(`E 攻击 ${state.actionTarget.name}`);
  } else if (!player.gear.cactusSuit && player.inventory.cactusHide >= 3) {
    setPrompt("F 制作仙人掌吉利服");
  } else if (!player.gear.warmCoat && player.inventory.penguinHide >= 2) {
    setPrompt("F 制作企鹅皮保暖衣");
  } else if (player.inventory.herbs >= state.biome.plantNeed) {
    setPrompt("F 制作回血药");
  } else if (player.inventory.potions > 0 && player.health < player.maxHealth) {
    setPrompt("R 使用回血药");
  } else {
    setPrompt("WASD");
  }
}

function setPrompt(text) {
  promptBox.textContent = text;
  promptBox.classList.toggle("is-visible", Boolean(text));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = 2.5;
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (state.mode === "map") {
    startTrip(screenToLonLat(x, y));
  }
}

function handlePointerMove(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d"].includes(key)) {
    keys.add(key);
    event.preventDefault();
  }
  if (key === "e") interact();
  if (key === "f") craft();
  if (key === "r") usePotion();
  if (key === "m") returnToMap();
}

function handleKeyUp(event) {
  keys.delete(event.key.toLowerCase());
}

function loop(now) {
  const dt = clamp((now - lastTime) / 1000, 0, 0.033);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resize);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
canvas.addEventListener("click", handleCanvasClick);
canvas.addEventListener("pointermove", handlePointerMove);
mapButton.addEventListener("click", returnToMap);
restartButton.addEventListener("click", restartGame);

resize();
updateHud();
requestAnimationFrame(loop);
