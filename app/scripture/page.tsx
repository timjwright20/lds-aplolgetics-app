import ScriptureBrowser from "@/components/ScriptureBrowser";
import { getScriptureTree } from "@/lib/dataAccess";

export default function ScriptureIndexPage() {
  const tree = getScriptureTree();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-maroon-900">Browse by Scripture</h1>
      <p className="mb-6 text-sm text-gray-600">
        Organized in canonical order: Old Testament, New Testament, Book of Mormon, Doctrine and
        Covenants, and the Pearl of Great Price. Prefer to browse by subject instead?{" "}
        <a href="/" className="text-maroon-700 underline">
          Switch to Topic mode.
        </a>
      </p>
      <ScriptureBrowser tree={tree} />
    </div>
  );
}
