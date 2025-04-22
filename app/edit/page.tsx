import { PublicImageEditor } from "./components/PublicImageEditor";

export default function PublicEditorPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-2xl font-bold mb-6">Quick Image Editor</h1>
      <PublicImageEditor />
    </div>
  );
}
