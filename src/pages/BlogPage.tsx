import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

// Sample blog posts - replace with dynamic content from API/CMS
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Screen Recording",
    excerpt: "Learn the basics of professional screen recording and how to create engaging content for your audience.",
    author: "CF TechLab Team",
    date: "March 28, 2026",
    category: "Tutorial",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Web Development Best Practices",
    excerpt: "Discover essential tips and tricks to improve your web development workflow and code quality.",
    author: "CF TechLab Team",
    date: "March 25, 2026",
    category: "Development",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Streamlining Your Workflow with Automation",
    excerpt: "Explore how automation can save you time and increase productivity in your daily tasks.",
    author: "CF TechLab Team",
    date: "March 22, 2026",
    category: "Productivity",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(blogPosts.map((post) => post.category)))];
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return blogPosts.filter((post) => {
      const categoryMatch = selectedCategory === "All" || post.category === selectedCategory;
      const searchMatch =
        normalizedQuery.length === 0 ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.author.toLowerCase().includes(normalizedQuery);

      return categoryMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <Helmet>
        <title>Blog - CF TechLab</title>
        <meta name="description" content="Read the latest articles and insights from CF TechLab about technology, development, and innovation." />
      </Helmet>
      <Header />
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-hero">
              Our Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and updates from the CF TechLab team about technology and innovation.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-8 p-5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label htmlFor="blog-search" className="block text-sm font-medium mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="blog-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search posts, topics, or author"
                    className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="blog-category-filter" className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  id="blog-category-filter"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} found
              </span>
              {(searchQuery || selectedCategory !== "All") && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center border border-border/60 rounded-xl p-10 mb-12 bg-card/30 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-2">No matching posts found</h2>
              <p className="text-muted-foreground mb-5">
                Try another keyword or category to find the content you are looking for.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border/50 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                {/* Post Header */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>

                  {/* Title and Excerpt */}
                  <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                  <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Author */}
                  <p className="text-sm text-muted-foreground mb-4">By {post.author}</p>

                  {/* Read More Button */}
                  <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
                    Read More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
            </div>
          )}

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 md:p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to get the latest articles and updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-background border border-border/50 focus:border-primary outline-none transition-colors"
              />
              <Button variant="hero">Subscribe</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
