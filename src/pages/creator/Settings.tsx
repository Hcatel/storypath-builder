
import { Header } from "@/components/Header";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export default function CreatorSettings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    // Update document class
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Store preference
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
