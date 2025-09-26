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
