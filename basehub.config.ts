import { setGlobalConfig } from "basehub";

const _vercel_url_env = "VERCEL_URL";

let v0Id = process.env[_vercel_url_env];
if (v0Id && v0Id.includes("vusercontent")) {
  v0Id = v0Id.split(".")[0];
}

const playgroundId = `${v0Id ? encodeURIComponent(v0Id) : "__dev"}__rel_v0`;

setGlobalConfig({
  fallbackPlayground: playgroundId
    ? { target: "basehub/waitlist-template", id: playgroundId }
    : undefined,
});
