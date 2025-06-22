
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { Tool, FilterState } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  tools: Tool[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userId: string | null;
}

export const Sidebar = ({
  tools,
  filters,
  onFiltersChange,
  isCollapsed,
  onToggleCollapse,
  userId
}: SidebarProps) => {
  const categories = [...new Set(tools.map(t => t.category).filter(Boolean))].sort();
  const allTags = tools.flatMap(t => t.tags || []);
  const tagCounts = allTags.reduce((acc: Record<string, number>, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(e => e[0]);

  const handleCategoryFilter = (category: string | null) => {
    onFiltersChange({ ...filters, category });
  };

  const handleTagFilter = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  return (
    <aside className={`bg-gray-800/50 backdrop-blur-sm p-6 flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-white">DevTools Hub</h1>
          )}
          {isCollapsed && (
            <Rocket className="text-3xl text-indigo-400 mx-auto" />
          )}
        </div>

        {!isCollapsed && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Filtros</h3>
            <div className="space-y-6">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Pesquisa por texto</label>
                <Input
                  type="text"
                  placeholder="Buscar por nome, tag..."
                  value={filters.text}
                  onChange={(e) => onFiltersChange({ ...filters, text: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <h4 className="text-gray-300 text-sm mb-2">Categorias</h4>
                <div className="space-y-1">
                  <Button
                    variant={filters.category === null ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => handleCategoryFilter(null)}
                  >
                    Todas
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={filters.category === category ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-gray-300 text-sm mb-2">Tags Populares</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "secondary"}
                      className="cursor-pointer text-xs"
                      onClick={() => handleTagFilter(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div>
          <p className="text-xs text-gray-600 mt-8 font-mono break-all">
            ID: {userId || 'N/A'}
          </p>
        </div>
      )}
    </aside>
  );
};
