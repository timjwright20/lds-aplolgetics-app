import TopicGrid from "@/components/TopicGrid";
import { getAllTopics, getAllCategories } from "@/lib/dataAccess";

export default function HomePage() {
  const topics = getAllTopics();
  const categories = getAllCategories();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-maroon-900">Browse by Topic</h1>
      <p className="mb-6 text-sm text-gray-600">
        {topics.length} topic{topics.length === 1 ? "" : "s"}. Click a topic to see supporting
        Bible scriptures, LDS scriptures, and quotations from early church fathers, LDS leaders,
        and apologists. Prefer to browse by verse instead?{" "}
        <a href="/scripture" className="text-maroon-700 underline">
          Switch to Scripture mode.
        </a>
      </p>
      <TopicGrid topics={topics} categories={categories} />
    </div>
  );
}
