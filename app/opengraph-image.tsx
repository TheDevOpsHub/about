import { ImageResponse } from "next/og";
import { OgTemplate, OG_SIZE, OG_CONTENT_TYPE } from "@/components/og/og-template";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(<OgTemplate title="Home" subtitle={siteConfig.description} />, size);
}
