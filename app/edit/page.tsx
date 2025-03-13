import { PublicImageEditor } from "./components/PublicImageEditor";

export default function PublicEditorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Quick Image Editor</h1>
      <PublicImageEditor />
    </div>
  );
}
