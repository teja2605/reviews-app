
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useSupabaseAuth";
import { Plus, Star, LogOut, Shield } from "lucide-react";

const Navbar = () => {
  const { user, profile, signOut, isAdmin } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ReviewHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/add-product">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </Button>
                </Link>
                
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Button>
                  </Link>
                )}
                
                <span className="text-sm text-gray-600">
                  Welcome, {profile?.name || profile?.email}
                  {isAdmin && <span className="ml-1 text-blue-600 font-medium">(Admin)</span>}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
