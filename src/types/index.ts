import { SCRIPT_BLOCK_TYPES } from "../constants";

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  role: "assistant" | "user";
};

export type User = {
  id: string;
  fullname: string;
  profilePicFileName?: string;
  email: string;
  birthdate: Date;
};

export type Script = {
  id: string;
  userId: string;
  title: string;
  description: string;
  blockIds: string[];
  updatedAt: string;
  createdAt: string;
};

export type DecoratedScript = Omit<Script, "blockIds"> & {
  blocks: ScriptBlock[];
};

export type ScriptBlockType = (typeof SCRIPT_BLOCK_TYPES)[number];

export type ScriptBlock = {
  id: string;
  type: ScriptBlockType;
  content: string;
};
