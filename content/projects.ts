import data from "./projects.json";
import { asset } from "../lib/asset";

export type FrameRole = "idea" | "plan" | "light" | "node" | "material";

export type Frame = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  label: string;
  role: FrameRole;
};

export type Project = {
  id: string;
  title: string;
  meta: string;
  copy: string;
  layout: "left" | "right";
  frames: Frame[];
};

const roles = new Set<FrameRole>(["idea", "plan", "light", "node", "material"]);

export const imageSizes = "(max-width: 800px) calc(100vw - 32px), 570px";

const frameSize = [1050, 1140] as const;

function photo(file: string, label: string, role: FrameRole): Frame {
  const [width, height] = frameSize;
  const src = `${asset(file)}?v=2`;
  return {
    src,
    srcSet: `${src} ${width}w`,
    width,
    height,
    label,
    role,
  };
}

function imagePath(image: string) {
  if (image.startsWith("/")) return image;
  return `/visuals/${image.replace(/^visuals\//, "")}`;
}

function roleOf(value: string): FrameRole {
  return roles.has(value as FrameRole) ? (value as FrameRole) : "idea";
}

function slug(value: string, index: number) {
  const id = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  return id || `projekt-${index + 1}`;
}

const seen = new Set<string>();

export const projects: Project[] = data.projects.flatMap((project, index) => {
  const frames = project.frames
    .filter((frame) => frame.image.trim())
    .map((frame) => photo(imagePath(frame.image), frame.label, roleOf(frame.role)));
  if (!project.title.trim() || frames.length === 0) return [];

  let id = slug(project.id, index);
  if (seen.has(id)) id = `${id}-${index + 1}`;
  seen.add(id);

  return [
    {
      id,
      title: project.title,
      meta: project.meta,
      copy: project.copy,
      layout: project.layout === "right" ? "right" : "left",
      frames,
    },
  ];
});
