
import { ChevronLeft, ChevronRight, Rocket, Sun, Moon } from 'lucide-react';
import { Tool, FilterState } from '@/types/devtools';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

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
  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Frontend': 'from-blue-500 to-cyan-500',
      'Backend': 'from-green-500 to-emerald-500',
      'Database': 'from-purple-500 to-pink-500',
      'DevOps': 'from-orange-500 to-red-500',
      'Design': 'from-pink-500 to-rose-500',
      'Testing': 'from-yellow-500 to-amber-500',
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <aside className={`${
      theme === 'dark' ? 'glass' : 'glass-light'
    } flex-shrink-0 flex flex-col justify-between transition-all duration-500 ease-in-out transform ${
      isCollapsed 
        ? 'w-20' 
        : isMobile 
          ? 'w-80 absolute left-0 top-0 h-full z-40' 
          : 'w-80'
    } ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
      
      {/* Overlay para mobile */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onToggleCollapse}
        />
      )}

      <div className="p-6 relative z-40">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-scale">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 animate-float">
                <Rocket className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DevTools Hub
              </h1>
            </div>
          )}
          
          {isCollapsed && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 animate-float mx-auto">
              <Rocket className="text-white" size={20} />
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="mb-6 animate-slide-in-right">
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            onClick={toggleTheme}
            className="button-glow w-full justify-start"
            title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {!isCollapsed && <span className="ml-2">Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Filtros
            </h3>
            
            {/* Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisa por texto</label>
              <Input
                type="text"
                placeholder="Buscar por nome, tag..."
                value={filters.text}
                onChange={(e) => onFiltersChange({ ...filters, text: e.target.value })}
                className="smooth-transition focus-ring bg-background/50 backdrop-blur-sm"
              />
            </div>

            {/* Categorias */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Categorias</h4>
              <div className="space-y-2">
                <Button
                  variant={filters.category === null ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start smooth-transition button-glow"
                  onClick={() => handleCategoryFilter(null)}
                >
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 mr-3" />
                  Todas
                </Button>
                
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={filters.category === category ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start smooth-transition button-glow animate-slide-in-right"
                    onClick={() => handleCategoryFilter(category)}
                    style={{ animationDelay: `${categories.indexOf(category) * 0.1}s` }}
                  >
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(category)} mr-3`} />
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags Populares */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Tags Populares</h4>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "secondary"}
                    className="cursor-pointer text-xs smooth-transition hover:scale-105 animate-fade-in-scale"
                    onClick={() => handleTagFilter(tag)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-6 border-t border-border/50 animate-fade-in-up">
          <p className="text-xs text-muted-foreground font-mono break-all">
            ID: {userId || 'N/A'}
          </p>
        </div>
      )}
    </aside>
  );
};
