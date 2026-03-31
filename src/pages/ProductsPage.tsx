import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Download,
  Globe,
  Github,
  Search,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

type ProductStatus = "live" | "coming-soon";
type ProductCategory = "Recording" | "Creative" | "Education";
type ProductActionVariant = "hero" | "outline";

interface ProductAction {
  label: string;
  href?: string;
  icon: LucideIcon;
  variant: ProductActionVariant;
  external?: boolean;
  disabled?: boolean;
}

interface Product {
  name: string;
  subtitle: string;
  category: ProductCategory;
  status: ProductStatus;
  icon: LucideIcon;
  features: string[];
  actions: ProductAction[];
}

const products: Product[] = [
  {
    name: "Pro Screen Cam",
    subtitle: "Professional screen recording and streaming solution",
    category: "Recording",
    status: "live",
    icon: Zap,
    features: [
      "High-quality screen recording with audio support",
      "Cross-platform support (Desktop & Web)",
      "Easy sharing and export capabilities",
      "Minimal resource consumption",
    ],
    actions: [
      {
        label: "Try Web Version",
        href: "https://pro-screen-cam.vercel.app/",
        icon: Globe,
        variant: "hero",
        external: true,
      },
      {
        label: "Download Desktop",
        href: "https://github.com/Creativity-Freaks/pro-screen-cam/releases",
        icon: Download,
        variant: "outline",
        external: true,
      },
      {
        label: "View on GitHub",
        href: "https://github.com/Creativity-Freaks/pro-screen-cam",
        icon: Github,
        variant: "outline",
        external: true,
      },
    ],
  },
  {
    name: "FreakFlow",
    subtitle: "AI-powered creative flow platform for rapid visual prototyping",
    category: "Creative",
    status: "live",
    icon: Sparkles,
    features: [
      "Turns rough ideas into polished creative outputs",
      "Built for fast iteration and experimentation",
      "Smooth integration with modern creative workflows",
    ],
    actions: [
      {
        label: "Explore FreakFlow",
        href: "/#freakflow",
        icon: Sparkles,
        variant: "hero",
        external: false,
      },
    ],
  },
  {
    name: "Proshnobank",
    subtitle: "Smart question bank platform for learners and educators",
    category: "Education",
    status: "coming-soon",
    icon: BookOpen,
    features: [
      "Practice-ready question sets across multiple categories",
      "Performance tracking and progress insights",
      "Designed for students, job seekers, and exam prep",
    ],
    actions: [
      {
        label: "Launching Soon",
        icon: BookOpen,
        variant: "outline",
        disabled: true,
      },
    ],
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");
  const [selectedStatus, setSelectedStatus] = useState<"all" | ProductStatus>("all");

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const statusMatch = selectedStatus === "all" || product.status === selectedStatus;
      const searchMatch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.subtitle.toLowerCase().includes(normalizedQuery) ||
        product.features.some((feature) => feature.toLowerCase().includes(normalizedQuery));

      return categoryMatch && statusMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  return (
    <>
      <Helmet>
        <title>Products - CF TechLab</title>
        <meta
          name="description"
          content="Explore our innovative digital products designed to boost your productivity and workflow."
        />
      </Helmet>
      <Header />
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-hero">
              Our Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Innovative tools and solutions designed to enhance your workflow and productivity.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-10 p-5 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label htmlFor="product-search" className="block text-sm font-medium mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="product-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products, features, or keywords"
                    className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as "All" | ProductCategory)}
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

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground mr-1">Status Filter:</span>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedStatus === "all" ? "hero" : "outline"}
                  onClick={() => setSelectedStatus("all")}
                >
                  All
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedStatus === "live" ? "hero" : "outline"}
                  onClick={() => setSelectedStatus("live")}
                >
                  Live
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedStatus === "coming-soon" ? "hero" : "outline"}
                  onClick={() => setSelectedStatus("coming-soon")}
                >
                  Coming Soon
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
                </span>
                {(searchQuery || selectedCategory !== "All" || selectedStatus !== "all") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedStatus("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center border border-border/60 rounded-xl p-10 bg-card/30">
              <h2 className="text-2xl font-semibold mb-2">No matching products found</h2>
              <p className="text-muted-foreground mb-5">
                Try another keyword, category, or status filter to discover available products.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedStatus("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
              {filteredProducts.map((product) => {
                const ProductIcon = product.icon;

                return (
                  <div
                    key={product.name}
                    className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6 gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <ProductIcon className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-bold">{product.name}</h2>
                          </div>
                          <p className="text-muted-foreground">{product.subtitle}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                            {product.category}
                          </span>
                          {product.status === "coming-soon" && (
                            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-8 space-y-3">
                        {product.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                            <p className="text-foreground">{feature}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        {product.actions.map((action) => {
                          const ActionIcon = action.icon;

                          return (
                            <Button
                              key={action.label}
                              type="button"
                              variant={action.variant}
                              disabled={action.disabled}
                              onClick={() => {
                                if (!action.href || action.disabled) {
                                  return;
                                }

                                if (action.external) {
                                  window.open(action.href, "_blank", "noopener,noreferrer");
                                  return;
                                }

                                window.open(action.href, "_self");
                              }}
                              className="flex items-center gap-2"
                            >
                              <ActionIcon className="w-4 h-4" />
                              {action.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">We are actively building and shipping more products.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
