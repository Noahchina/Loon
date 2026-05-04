// Loon Pure Check Ultimate

const timeout = 7000;

function get(url) {
  return new Promise((resolve) => {
    $httpClient.get({ url, timeout }, (err, resp, data) => {
      resolve({ err, resp, data });
    });
  });
}

async function run() {
  let score = 0;
  let msg = [];

  // =====================
  // 1. IP质量（强化）
  // =====================
  try {
    let r = await get("http://ip-api.com/json");
    let j = JSON.parse(r.data);

    msg.push(`🌍 ${j.country} | ${j.isp}`);

    let isp = (j.isp || "").toLowerCase();

    if (isp.match(/amazon|google|microsoft|oracle|cloud/)) {
      msg.push("❌ 机房IP");
    } else if (isp.match(/telecom|comcast|verizon|att|vodafone/)) {
      score += 30;
      msg.push("🟢 住宅IP");
    } else {
      score += 15;
      msg.push("🟡 商业IP");
    }
  } catch {
    msg.push("🌍 IP检测失败");
  }

  // =====================
  // 2. DNS检测
  // =====================
  try {
    let dns = await get("https://1.1.1.1/cdn-cgi/trace");

    if (dns.data.includes("warp=off")) {
      score += 10;
      msg.push("🌐 DNS: 正常");
    } else {
      msg.push("🌐 DNS: 异常");
    }
  } catch {
    msg.push("🌐 DNS失败");
  }

  // =====================
  // 3. Cloudflare风控
  // =====================
  try {
    let cf = await get("https://www.cloudflare.com/cdn-cgi/trace");

    if (!cf.data.includes("challenge")) {
      score += 15;
      msg.push("☁️ CF: 正常");
    } else {
      msg.push("☁️ CF: 风控");
    }
  } catch {
    msg.push("☁️ CF失败");
  }

  // =====================
  // 4. Netflix（细分）
  // =====================
  try {
    let nf = await get("https://www.netflix.com/title/80018499");

    if (nf.resp.status == 200) {
      score += 20;
      msg.push("🎬 Netflix: 全解锁");
    } else if (nf.resp.status == 403) {
      msg.push("🎬 Netflix: 自制");
    } else {
      msg.push("🎬 Netflix: ❌");
    }
  } catch {
    msg.push("🎬 Netflix: ❌");
  }

  // =====================
  // 5. ChatGPT（加强）
  // =====================
  try {
    let gpt = await get("https://chat.openai.com");

    if (gpt.resp.status == 200) {
      score += 10;
      msg.push("🤖 ChatGPT: 正常");
    } else {
      msg.push("🤖 ChatGPT: 风控");
    }
  } catch {
    msg.push("🤖 ChatGPT: ❌");
  }

  // OpenAI API
  try {
    let api = await get("https://api.openai.com/v1/models");

    if (api.resp.status == 401) {
      score += 10;
      msg.push("🧠 OpenAI API: 可访问");
    } else {
      msg.push("🧠 OpenAI API: 异常");
    }
  } catch {
    msg.push("🧠 OpenAI API: ❌");
  }

  // =====================
  // 6. Gemini（增强）
  // =====================
  try {
    let gm = await get("https://generativelanguage.googleapis.com");

    if (gm.resp.status == 200 || gm.resp.status == 404) {
      score += 15;
      msg.push("✨ Gemini: 可用");
    } else {
      msg.push("✨ Gemini: 风控");
    }
  } catch {
    msg.push("✨ Gemini: ❌");
  }

  // =====================
  // 等级评估
  // =====================
  let level = "🔴 风险";

  if (score >= 80) level = "🟢 优质";
  else if (score >= 60) level = "🟡 一般";

  msg.push(`\n📊 评分: ${score}/100`);
  msg.push(`🏷 等级: ${level}`);

  $notification.post("节点纯净度 Ultimate", "", msg.join("\n"));
  $done();
}

run();