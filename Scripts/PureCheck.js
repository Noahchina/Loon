// Loon Pure Check Ultimate FIX

const timeout = 5000;

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

  // IP
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
    msg.push("🌍 IP失败");
  }

  // DNS
  try {
    let dns = await get("https://1.1.1.1/cdn-cgi/trace");
    if (dns.data && dns.data.includes("warp=off")) {
      score += 10;
      msg.push("🌐 DNS正常");
    } else {
      msg.push("🌐 DNS异常");
    }
  } catch {
    msg.push("🌐 DNS失败");
  }

  // CF
  try {
    let cf = await get("https://www.cloudflare.com/cdn-cgi/trace");
    if (cf.data && !cf.data.includes("challenge")) {
      score += 15;
      msg.push("☁️ CF正常");
    } else {
      msg.push("☁️ CF风控");
    }
  } catch {
    msg.push("☁️ CF失败");
  }

  // Netflix
  try {
    let nf = await get("https://www.netflix.com/title/80018499");
    if (nf.resp && nf.resp.status == 200) {
      score += 20;
      msg.push("🎬 Netflix全解锁");
    } else if (nf.resp && nf.resp.status == 403) {
      msg.push("🎬 Netflix自制");
    } else {
      msg.push("🎬 Netflix❌");
    }
  } catch {
    msg.push("🎬 Netflix失败");
  }

  // ChatGPT
  try {
    let gpt = await get("https://chat.openai.com");
    if (gpt.resp && gpt.resp.status == 200) {
      score += 10;
      msg.push("🤖 ChatGPT正常");
    } else {
      msg.push("🤖 ChatGPT异常");
    }
  } catch {
    msg.push("🤖 ChatGPT失败");
  }

  // OpenAI API
  try {
    let api = await get("https://api.openai.com/v1/models");
    if (api.resp && api.resp.status == 401) {
      score += 10;
      msg.push("🧠 API可访问");
    } else {
      msg.push("🧠 API异常");
    }
  } catch {
    msg.push("🧠 API失败");
  }

  // Gemini
  try {
    let gm = await get("https://generativelanguage.googleapis.com");
    if (gm.resp && (gm.resp.status == 200 || gm.resp.status == 404)) {
      score += 15;
      msg.push("✨ Gemini可用");
    } else {
      msg.push("✨ Gemini异常");
    }
  } catch {
    msg.push("✨ Gemini失败");
  }

  let level = "🔴 风险";
  if (score >= 80) level = "🟢 优质";
  else if (score >= 60) level = "🟡 一般";

  msg.push(`\n📊 ${score}/100`);
  msg.push(`🏷 ${level}`);

  $notification.post("PureCheck", "", msg.join("\n"));
}

// 关键修复
!(async () => {
  await run();
  $done();
})().catch(e => {
  $notification.post("脚本错误", "", String(e));
  $done();
});