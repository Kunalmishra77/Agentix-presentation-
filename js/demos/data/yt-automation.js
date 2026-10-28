(function (w) {
  "use strict";
  var AX = w.AX = w.AX || {};
  AX.data = AX.data || {};
  var F = AX.fake;
  var IMG = "assets/media/yt/";

  var STYLE = "3D animated cartoon film, Pixar style, cinematic lighting, highly detailed, vertical 9:16 composition";
  var scenes = [
    { id: "s1", n: 1, title: "The sky turns black", img: IMG + "s1.jpg",
      prompt: "A peaceful green valley village of round thatched-roof huts at the foot of a giant green hill, warm evening light, but the sky above is turning dark and stormy with heavy black clouds rolling in. " + STYLE,
      narration: "In a green valley, a happy village lived under a great hill. But one evening, the sky turned black with anger.",
      motion: "Storm clouds roll in fast, trees sway in rising wind, first raindrops fall, slow ominous crane-down toward the village.", caption: "The sky turned black" },
    { id: "s2", n: 2, title: "A storm meant to drown them", img: IMG + "s2.jpg",
      prompt: "A furious thunderstorm hammering a village with sheets of rain, forked lightning, terrified villagers in colorful clothes running for cover, dark dramatic sky. " + STYLE,
      narration: "A furious storm-god sent rain to drown their homes. The people ran, afraid, with nowhere left to hide.",
      motion: "Torrential rain pours down, lightning flashes, villagers run in panic, camera shakes with the thunder.", caption: "A storm meant to drown them" },
    { id: "s3", n: 3, title: "One boy was not afraid", img: IMG + "s3.jpg",
      prompt: "An 8-year-old Indian boy Krishna with dark curly hair, a peacock feather and a yellow dhoti, standing calm and fearless in pouring rain while villagers run behind him, gentle confident smile, close-up. " + STYLE,
      narration: "But one small boy stood still in the rain. He was not afraid, he simply smiled up at the sky.",
      motion: "The boy stands calm as rain falls, slowly looks up and smiles, villagers rush past behind him, gentle push-in on his face.", caption: "One boy was not afraid" },
    { id: "s4", n: 4, title: "He lifted it on one finger", img: IMG + "s4.jpg",
      prompt: "Krishna lifting an entire massive green mountain effortlessly on the tip of one raised finger, holding it high like a giant umbrella, soft divine golden light, epic low-angle hero shot. " + STYLE,
      narration: "He walked to the great mountain, bent down, and lifted the whole hill on a single finger.",
      motion: "The boy raises one finger and the huge mountain lifts off the ground, dust and light swirl, epic slow low-angle push-in.", caption: "He lifted it on one finger" },
    { id: "s5", n: 5, title: "The whole village, safe", img: IMG + "s5.jpg",
      prompt: "A whole village of families, children and cows sheltering safely under a giant green mountain held up by Krishna, warm golden glow beneath the hill while the storm rages harmlessly above. " + STYLE,
      narration: "Under that mountain, the entire village stayed warm and dry, while the storm raged high above.",
      motion: "Villagers gather warmly under the floating mountain, rain pours off its edges, gentle camera drift across grateful faces.", caption: "The whole village, safe" },
    { id: "s6", n: 6, title: "Smallest hands, whole world", img: IMG + "s6.jpg",
      prompt: "Krishna smiling warmly at golden sunset after the storm as grateful villagers gather around him, peaceful triumphant mood, warm light filling the frame. " + STYLE,
      narration: "When the sky cleared, the boy smiled. Sometimes the smallest hands hold up the whole world.",
      motion: "The sky clears to golden sunset, the boy smiles, villagers gather joyfully, slow cinematic pull-back rising into warm light.", caption: "The smallest hands" }
  ];

  var channels = ["Katha Kids (Hindi)", "Mythic Minutes (English)", "Dadi ki Kahani (Hinglish)"];
  var voices = ["George — warm narrator (EN)", "Aanya — storyteller (HI)", "Rohan — friendly (Hinglish)", "My own voice (cloned)"];

  var characters = [
    { id: "ch1", name: "Krishna", role: "Hero, age 8", voice: "My own voice (cloned)", lang: "Hindi / English", scenes: "3, 4, 5, 6", img: IMG + "s3.jpg", look: "Dark curly hair, one peacock feather, yellow dhoti, small gold necklace, warm brown skin, big gentle eyes." },
    { id: "ch2", name: "Narrator", role: "Voice-over", voice: "George — warm narrator (EN)", lang: "English", scenes: "1–6", img: IMG + "s1.jpg", look: "Off-screen. Warm, unhurried, slightly mysterious." },
    { id: "ch3", name: "Village elder", role: "Supporting", voice: "Aanya — storyteller (HI)", lang: "Hindi", scenes: "2, 5", img: IMG + "s5.jpg", look: "White turban, kind wrinkled face, orange shawl." },
    { id: "ch4", name: "Indra (storm-god)", role: "Antagonist", voice: "Rohan — friendly (Hinglish)", lang: "Hinglish", scenes: "2", img: IMG + "s2.jpg", look: "Towering silhouette in storm clouds, lightning crown." },
    { id: "ch5", name: "Gopi children", role: "Ensemble", voice: "Aanya — storyteller (HI)", lang: "Hindi", scenes: "5, 6", img: IMG + "s6.jpg", look: "Group of five kids in bright festival clothes." }
  ];

  var titles = [
    ["Govardhan: the boy who lifted a mountain", "s4", "Scheduled", 128400, 61, 9.4, true],
    ["Hanuman and the sun", "s1", "Published", 96200, 58, 8.1],
    ["The clever crow, retold", "s2", "Published", 74800, 55, 7.3],
    ["Tenali Rama and the thieves", "s3", "Published", 61900, 63, 8.8],
    ["Why the moon has spots", "s5", "Published", 45100, 49, 6.2],
    ["Ganesha and the mango", "s6", "In QA", 0, 0, 0],
    ["Birbal's riddle of the river", "s2", "Rendering", 0, 0, 0],
    ["The lion who learned to share", "s1", "Published", 38700, 52, 6.9]
  ].map(function (t, i) {
    return { id: "V-" + (320 + i), title: t[0], poster: IMG + t[1] + ".jpg", status: t[2], views: t[3], retention: t[4], ctr: t[5], playable: !!t[6], channel: channels[i % 3], cost: (2.9 + (i % 4) * 0.12).toFixed(2), date: "2026-10-" + (26 - i * 2 > 9 ? 26 - i * 2 : "0" + (26 - i * 2)) };
  });

  var stageCost = [["research", 0.02], ["script", 0.05], ["voice", 0.18], ["keyframes", 0.42], ["motion", 2.4], ["assembly", 0.1], ["thumb", 0.06]];

  var approvals = [
    { id: "ap1", col: "review", title: "Ganesha and the mango", sub: "Katha Kids (Hindi)", tags: ["Needs QA"], meta: "Rendered 2h ago · $3.18" },
    { id: "ap2", col: "review", title: "Birbal's riddle of the river", sub: "Dadi ki Kahani", tags: ["Needs QA"], meta: "Rendered 5h ago · $3.04" },
    { id: "ap3", col: "changes", title: "Why the sky is blue", sub: "Mythic Minutes", tags: ["Caption typo"], meta: "Reviewer: Kabir D." },
    { id: "ap4", col: "approved", title: "Govardhan: the boy who lifted a mountain", sub: "Katha Kids (Hindi)", tags: ["Scheduled"], meta: "Goes live 3 Nov, 6:30 PM" },
    { id: "ap5", col: "approved", title: "Hanuman and the sun", sub: "Mythic Minutes", tags: ["Published"], meta: "Live" }
  ];

  var prompts = [
    ["Research", "research.topic.v3", "Find 5 public-domain angles on the story prompt; return hook, conflict, moral. No copyrighted dialogue.", 410, 0.02],
    ["Script", "script.shortform.v6", "Write a 36-second narrated script in 6 beats, one sentence per beat, ending with a moral. Language: {language}.", 620, 0.05],
    ["Keyframe", "keyframe.pixar3d.v4", "{character_look}, {beat_action}. 3D animated cartoon film, Pixar style, cinematic lighting, vertical 9:16.", 180, 0.07],
    ["Motion", "motion.kling.v3", "{motion_direction}. Smooth camera, no warped faces, no extra limbs.", 90, 0.4],
    ["Thumbnail", "thumb.contrast.v2", "Close-up of the hero, high contrast, 3 word title in {language}, glow edge.", 140, 0.06],
    ["SEO", "seo.titletags.v2", "Return a 55-char title, 150-char description and 12 tags for Shorts.", 260, 0.01]
  ].map(function (p, i) { return { id: "pr" + i, name: p[0], key: p[1], text: p[2], tokens: p[3], cost: p[4], version: p[1].split(".").pop(), updated: "2026-10-" + (14 + i) }; });

  var api = [
    ["OpenAI", "Script + image generation (gpt-image-1)", 0.47, 14, "Operational"],
    ["ElevenLabs", "Narration (cloned voice)", 0.18, 6, "Operational"],
    ["fal.ai · Kling v3", "Image-to-video motion clips", 2.4, 6, "Degraded"],
    ["Render worker", "FFmpeg assembly + captions", 0.1, 1, "Operational"],
    ["YouTube Data API", "Upload + schedule", 0.0, 2, "Operational"]
  ].map(function (a, i) { return { id: "api" + i, provider: a[0], use: a[1], spend: a[2], spendText: "$" + a[2].toFixed(2), calls: a[3], status: a[4] }; });

  var levels = ["INFO", "INFO", "INFO", "WARN", "INFO", "ERROR", "INFO"];
  var msgs = [
    ["research", "Topic angles ranked; picked Govardhan (hook score 0.91)"], ["script", "6-beat script generated (96 words)"], ["voice", "Narration synthesized, 35.9 s, aligned to captions"],
    ["keyframes", "6 keyframes rendered (gpt-image-1, medium)"], ["motion", "Kling v3 clip 4 retried after 504 (attempt 2/3)"], ["motion", "Clip 5 failed content-safety pre-check; prompt softened and resubmitted"],
    ["assembly", "Final.mp4 muxed 1080x1920, burned-in captions"], ["qa", "Waiting for human approval"], ["cost", "Cost governor: $3.23 of $4.00 ceiling"], ["publish", "Scheduled for 3 Nov, 6:30 PM IST"]
  ];
  var logs = msgs.map(function (m, i) {
    return { id: "lg" + i, at: "2026-10-27 " + (14 + Math.floor(i / 4)) + ":" + (10 + i * 4) + ":0" + (i % 10), level: i === 4 ? "WARN" : i === 5 ? "WARN" : "INFO", stage: m[0], job: "J-" + (88 + (i % 3)), message: m[1] };
  });
  for (var k = 0; k < 8; k++) logs.push({ id: "lgx" + k, at: "2026-10-26 1" + k + ":2" + k + ":11", level: levels[k % 7], stage: ["research", "script", "voice", "motion", "assembly", "publish", "cost", "qa"][k], job: "J-" + (80 + k % 4), message: ["Topic angles ranked", "Script regenerated after QA note", "Voice sample approved", "Kling clip queued", "Captions burned (Hindi)", "Upload completed", "Cost governor: $2.98 of $4.00", "Approved by reviewer"][k] });

  AX.data["yt-automation"] = {
    scenes: scenes, channels: channels, voices: voices, characters: characters, videos: titles, stageCost: stageCost, approvals: approvals, prompts: prompts, api: api, logs: logs,
    labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
    retentionCurve: [100, 92, 84, 78, 71, 66, 63, 61],
    costSeries: F.series("ytc", 12, 28, 34).map(function (v) { return v / 10; })
  };
})(window);
